
.PHONY: clean

control: control.c ../lolproto.h
	${CC} -Wall -I../ -o $@ $< -lm

clean:
	rm -f control
