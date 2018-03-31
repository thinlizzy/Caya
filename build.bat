@echo off
set "infile=src\caya.js"
set "outfile=dist\caya.min.js"
uglifyjs %infile% --compress --mangle --screw-ie8 -o %outfile%.tmp | more
type header.txt > %outfile%
type %outfile%.tmp >> %outfile%
del %outfile%.tmp
