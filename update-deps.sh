#!/bin/bash
git pull
npm install
bower install
grunt
forever restartall
