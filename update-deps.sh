#!/bin/bash
git fetch --all
git reset --hard origin/master
npm install
bower install
grunt
forever restartall
