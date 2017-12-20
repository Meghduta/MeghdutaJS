#!/bin/bash

echo "Benchmarking ", $1

# PUSH to a Queue
ab -p push.json -T application/json  -c 100 -n 5000 $1/meghduta/queue/push
sleep 2

# PULL from queue
ab -p pull.json -T application/json  -c 100 -n 5000 $1/meghduta/queue/pull
sleep 2

# Publish to a Topic, keep  
ab -p publish.json -T application/json  -c 100 -n 5000 $1/meghduta/topic/publish
sleep 5

# before pushing anything to bench time specially in case of HA mode
ab -p pull.json -T application/json  -c 100 -n 5000 $1/meghduta/queue/pull