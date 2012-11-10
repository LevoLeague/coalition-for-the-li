/*
  TEXT SAMPLE CODE for LOL Shield for Arduino
  Copyright 2009/2010 Benjamin Sonntag <benjamin@sonntag.fr> http://benjamin.sonntag.fr/
  
  History:
  	2009-12-31 - V1.0 FONT Drawing, at Berlin after 26C3 ;) 

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 59 Temple Place - Suite 330,
  Boston, MA 02111-1307, USA.
*/

#include "Charliplexing.h"
#include "Font.h"

#if defined(ARDUINO) && ARDUINO >= 100
#include "Arduino.h"
#else
#include "WProgram.h"
#endif

#define MAX_TEXT_LENGTH 256 // Max number of characters in string
char text[MAX_TEXT_LENGTH];

// The number of columns of LEDs minus one
#define X_MAX 13

/* -----------------------------------------------------------------  */
/** MAIN program Setup
 */
void setup()                    // run once, when the sketch starts
{
  LedSign::Init();
  Serial.begin(9600);
}


void getNewText(char* charArray) {
  /* Gets a new string from the serial port. */
  char charRead = '0';
  int charCount = 0;
  
  /* If the string is sent in multiple 
      parts, get each one separately */
  while (charCount < MAX_TEXT_LENGTH && charRead != '\n' && charRead != '\0') {
    
    while (Serial.available()) {
      charRead = char(Serial.read());
      charArray[charCount] = charRead;
      charCount++;
    }
  }
  
  // Append a null character to the end
  charArray[charCount] = '\0';
}

/* -----------------------------------------------------------------  */
/** MAIN program Loop
 */
void loop()                     // run over and over again
{
  char text[MAX_TEXT_LENGTH];
  getNewText(text);
  Serial.println(text);
  Serial.println("\n");
  
  // text[0] = 'f';
  // text[1] = 'u';
  // text[2] = '\0'; //"fucker";
  
  int x=0;
  for(int j=X_MAX; j>-100-X_MAX; j--) {
    x=j;
    LedSign::Clear();
    
    // Draw each character, offset by x "pixels"
    for(int i=0; i<100; i++) {
      x += Font::Draw(text[i],x,0);
      
      // If the character is off the screen, stop.
      if (x>=X_MAX) 
        break;
    }

    delay(80);
  }
  delay(3000);
}


