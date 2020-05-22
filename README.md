# Kastach.me

### This is the source code for https://kastach.me

[![Build Status](https://travis-ci.org/shevron/kastach.me.svg?branch=master)](https://travis-ci.org/shevron/kastach.me)

## What is it? 
COVID-19 Daily health statement form for kindergarten kids, as required by the 
State of Israel Ministry of Education. 

## Why?
Because filling in these forms manually is annoying and I tend to forget doing 
it. This is a mobile-friendly, simple app that is easy to fill and sign, 
and generates an image I can then send to the Kindergarten staff via WhatsApp
or email and be done with it. 

## Contributing
Feel free to offer improvements and patches and report bugs. However, keep in
mind this is something I'm doing for free, in my limited spare time, so PRs 
are more welcome than just bug reports. 

While currently there are no tests for this code, you can run lint simply 
by running:

    make test

In the future, this command may also run some unit tests. 

PRs that do not pass `make test` will not be accepted. For convenience, this
process is also executed by Travis CI automatically for each push / PR.  

## License
(C) 2020 Shahar Evron, all rights reserved. 

Kastach.me's code is distributed under a New BSD license, fully available on
the LICENSE file.  
