/*
  Requires LoL Shield library, at least V0.2Beta 
  http://code.google.com/p/lolshield/downloads/list

  Based on original TEXT SAMPLE CODE for LOL Shield for Arduino
  Copyright 2009/2010 Benjamin Sonntag <benjamin@sonntag.fr> http://benjamin.sonntag.fr/
  http://ee.walfas.org/2011/02/11/lol-shield/
  
  (Serial version edited by Walfas)
*/

#include "Charliplexing.h"
#include "Font.h"
#include "Arduino.h"

// The number of columns of LEDs minus one
#define X_MAX 13

// Scroll delay: lower values result in faster scrolling
#define SCROLL_DELAY 30

/* How long to wait after the last letter before
    going to the next message or starting over again */
#define NEXT_MSG_DELAY 0

#define MAX_TEXT_LENGTH 256 // Max number of characters in string

/* Print these values when trying to get the next part of the 
    current message or a new message. */
#define GET_MORE 'g'
#define GET_NEW 'n'

/* Used to calculate how many characters are in a string 
    and how many pixels that string takes up horizontally. */
int textLength, totalPixels;

// Initialize char array for text string
char text[MAX_TEXT_LENGTH];

void setup() {
  Serial.begin(9600);
  Serial.println("hi");
  LedSign::Init();
  Serial.println("done init");
  
  text[0] = '\0';
  getLength(text, &textLength, &totalPixels);
}

void loop() {
  // Read text from serial and determine the length
  getNewText(text);
  getLength(text, &textLength, &totalPixels);
  
  // Output the characters to the LED matrix
  int x=0;
  for(int j=X_MAX; j>-totalPixels-X_MAX; j--) {
    x=j;
    //LedSign::Clear();
    
    // Draw each character, offset by x "pixels"
    for(int i=0; i<textLength; i++) {
      x += Font::Draw(text[i],x,0);
      
      // If the character is off the screen, stop.
      if (x>=X_MAX) 
        break;
    }
    // Wait before moving everything to the left by one
    delay(SCROLL_DELAY);
  }
  // Wait before displaying the next message
  delay(NEXT_MSG_DELAY);
}

void getNewText(char* charArray) {
  /* Gets a new string from the serial port. */
  char charRead = '0';
  int charCount = 0;
  boolean waiting = false;
  
  // Request a new string
  Serial.write(GET_NEW);
  
  /* If the string is sent in multiple 
      parts, get each one separately */
  while (charCount < MAX_TEXT_LENGTH && charRead != '\n' && charRead != '\0') {
    if (!waiting) {
      Serial.write(GET_MORE); // Request next part of string
      waiting = true;
    }
    
    while (Serial.available()) {
      charRead = char(Serial.read());
      charArray[charCount] = charRead;
      charCount++;
      waiting = false;
    }
  }
  
  // Append a null character to the end
  charArray[charCount] = '\0';
}

void getLength(char* charArray, int* lengthPtr, int* pixelPtr) {
  /* Finds the length of a string in terms of characters
     and pixels and assigns them to the variable at 
     addresses lengthPtr and pixelPtr, respectively. */
      
  int charCount = 0, pixelCount = 0;
  char * charPtr = charArray;
  
  // Count chars until newline or null character reached
  while (charArray[charCount] != '\0' && charArray[charCount] != '\n') {
    charPtr++;
    charCount++;
    
    /* Increment pixelCount by the number of pixels 
       the current character takes up horizontally. */
    pixelCount += Font::Draw(charArray[charCount],-X_MAX,0);
  }

  *pixelPtr = pixelCount;
  *lengthPtr = charCount;
}


