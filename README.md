# MeghdutaJS
Meghduta is distributed in memory messaging service written in NodeJS. [Meghduta](https://en.wikipedia.org/wiki/Meghad%C5%ABta) literally means Cloud Messenger and we strive to be so. :)

## Features
- [X] Unlimited number of Queues (limited only by RAM memory)  
- [X] Unlimited number of Topics (limited only by RAM memory)
- [X] Auto create Queue or Topic if not exists already
- [X] Simple HTTP API for Queue operations (PUSH, PULL) and Topic operation (PUB)
- [X] Websocket API for Topic operations (PUB, SUB)
- [X] HA cluster - Shared
- [ ] HA cluster - Replicated
- [ ] Auto SSL

## Install 

`>> npm install -g meghduta`

see `examples` directory 


## Usage - Library package

see `examples/start.js`


## Usage - STANDALONE Mode

`>> meghduta `

Is equivalent to

`>> meghduta --httpPort 6600 --webSocketPort 6610`


## Usage - SHARED Mode

`one.example.com >> meghduta-shared --httpPort 6600 --webSocketPort 6610 --servers http://two.example.com:8080`

`two.example.com >> meghduta-shared --httpPort 8080 --webSocketPort 8081 --servers http://one.example.com:6600`


## Usage - SHARED Mode (more than 2 Servers)

`>> meghduta-shared --servers http://localhost:8080,http://localhost:9090`

`>> meghduta-shared --httpPort 8080 --webSocketPort 8081 --servers http://localhost:6600,http://localhost:9090`

`>> meghduta-shared --httpPort 9090 --webSocketPort 9091 --servers http://localhost:8080,http://localhost:6600`


## API

Target| Method | Port | URL           | Request                                                        | Response
------|--------|------|---------------|----------------------------------------------------------------|---------------------|
Queue | HTTP POST | 6600 | /meghduta/queue/push | { "queue" : "MY_QUEUE", "message" : "First message to be queued" }| 'Message queued'
Queue | HTTP POST | 6600 | /meghduta/queue/pull | { "queue" : "MY_QUEUE" }           | { "message : "First message to be queued" } |
Topic | HTTP POST | 6600 |/meghduta/topic/publish | { "topic" : "MY_TOPIC", "message" : "First message to be published" } | 'Message published'
Topic | WS Send | 6610 |/meghduta/topic | 'PUB MY_TOPIC Second message to be published' |
Topic | WS Send | 6610 |/meghduta/topic | 'SUB MY_TOPIC' |


## General Tips and Recommendation
- Don't use it in cluster mode with PM2, use HA Shared or Replicated mode instead
- HA cluster must be deployed behind load balancer
- Use keepAlive=true in http client when consuming HTTP API for best performance
- Use ZIP or LZ4 compression at client side for large message value
- Only Queue contents are SHARED or REPLICATED in HA mode, Topic PUB-SUB functionality remains same


## License
[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) 
