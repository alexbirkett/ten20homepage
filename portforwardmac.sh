#!/bin/bash
sudo ipfw add 101 fwd 127.0.0.1,4433 tcp from any to any 443 in
sudo ipfw add 100 fwd 127.0.0.1,3000 tcp from any to any 80 in

