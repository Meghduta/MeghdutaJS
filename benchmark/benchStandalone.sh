#!/bin/bash
set -e
trap "exit" INT TERM
trap "kill 0" EXIT

meghduta &
sleep 1

./bench.sh http://localhost:6600 