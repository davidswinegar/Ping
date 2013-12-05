#!/bin/bash
# must be run as su
export PORT=80
export SSLPORT=443
export NODE_ENV=production
node app.js &