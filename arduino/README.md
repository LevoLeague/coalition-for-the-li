CLITBOARD
========

Load the clitboard projet on to your arduino.

Feel free to play with it in the serial monitor. It will listen for a string until a null or newline. It will read it and then echo it back with a newline. (without the \n or \0 you sent.) 

It's safe to send up to 255 chars in a string.

Wait until it echo's back before sending more strings. (You could probably get away with buffering a second string, but don't be rude.)