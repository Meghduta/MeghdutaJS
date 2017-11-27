# MeghdutaJS
Meghduta is distributed in memory messaging service written in NodeJS. [Meghduta](https://en.wikipedia.org/wiki/Meghad%C5%ABta) literally means Cloud Messenger and we strive to be so. :)

## Features
- [X] Unlimited number of Queues (limited only by RAM memory)  
- [X] Unlimited number of Topics (limited only by RAM memory)
- [X] Auto create Queue or Topic if not exists already
- [X] Simple HTTP API for Queue operations (PUSH, PULL) and Topic operation (PUB)
- [X] Websocket API for Topic operations (PUB, SUB)
- [ ] Replication for failover and scalability
- [ ] Auto SSL


## API

Target| Method | Port | URL           | Request                                                        | Response
------|--------|------|---------------|----------------------------------------------------------------|---------------------|
Queue | HTTP POST | 6600 | /meghduta/queue/push | { "queue" : "MY_QUEUE", "message" : "First message to be queued" }| 'Message queued'
Queue | HTTP POST | 6600 | /meghduta/queue/pull | { "queue" : "MY_QUEUE" }           | { "message : "First message to be queued" } |
Topic | HTTP POST | 6600 |/meghduta/topic/push | { "topic" : "MY_TOPIC", "message" "First message to be published" } | 'Message published'
Topic | WS Send | 6610 |/meghduta/topic | 'PUB MY_TOPIC Second message to be published' |
Topic | WS Send | 6610 |/meghduta/topic | 'SUB MY_TOPIC' |



## License
[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) 
