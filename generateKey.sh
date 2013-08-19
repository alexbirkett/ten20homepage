#!/bin/bash

if [ -f 'key.pem' ];
then
   echo "key exists."
else
   echo "start generating key and cert..."
   openssl req -newkey rsa:2048 -new -subj "/C=NW/ST=Denial/L=Springfield/O=Dis/CN=ten20live.com" -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
fi
