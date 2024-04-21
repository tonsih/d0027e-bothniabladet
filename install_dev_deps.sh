#!/bin/sh

SCRIPT_DIR=$(dirname "$0")

npm i
cd "$SCRIPT_DIR/client"
npm i
