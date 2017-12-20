#!/bin/bash
set -e
trap "exit" INT TERM
trap "kill 0" EXIT

meghduta-shared --servers http://localhost:8800,http://localhost:9900 &
sleep 1

meghduta-shared --httpPort 8800 --webSocketPort 8810 --servers http://localhost:6600,http://localhost:9900 &
sleep 1

meghduta-shared --httpPort 9900 --webSocketPort 9910 --servers http://localhost:6600,http://localhost:8800 &
sleep 1


./bench.sh http://localhost:6600
sleep 1

./bench.sh http://localhost:8800
sleep 1

./bench.sh http://localhost:9900

