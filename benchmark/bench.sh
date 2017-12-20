#!/bin/bash

URL=${1:-"http://localhost:6600"}

echo "Benchmarking ", $URL

ab -p push.json -T application/json  -c 100 -n 5000 $URL/meghduta/queue/push

ab -p pull.json -T application/json  -c 100 -n 5000 $URL/meghduta/queue/pull

ab -p publish.json -T application/json  -c 100 -n 5000 $URL/meghduta/topic/publish