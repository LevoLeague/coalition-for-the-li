#!/usr/bin/env ruby
require 'json'

files = Dir.entries('./');
font = {};
files.each do |f|
  if f == '.' or f == '..' or /font/.match(f)
    next
  end
 letter = File.new(f, 'r').read;
 l = []
 row = 0
 col = 0
 letter.each_char do |c|
  if(l[row].class != Array)
    l[row] = []
  end
  if c == "\n"
    col = 0
    row += 1
    next
  elsif c == 'O'
    l[row][col] = 1
  elsif c == '.'
    l[row][col] = 0
  else
    raise c
  end
  col += 1
 end
 font[f] = l;
end

p font.to_json