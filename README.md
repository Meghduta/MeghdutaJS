# MeghdutaJS
Meghduta is distributed in memory messaging service written in NodeJS. [Meghduta](https://en.wikipedia.org/wiki/Meghad%C5%ABta) literally means Cloud Messenger and we strive to be so. :)

## Features
- [X] Unlimited number of Queues (limited only by RAM memory)  
- [X] Unlimited number of Topics (limited only by RAM memory)
- [X] Simple HTTP API for Queue operations (PUSH, PULL) and Topic operation (PUB)
- [X] Websocket API for Topic operations (PUB, SUB)
- [ ] Replication for failover and client connection scalability


## Queue API

`POST`  `/meghduta/queue/push` `{ "queue" : "MY_QUEUE", "message": "First message to be queued" }`

`POST` `/meghduta/queue/pull`  `{ "queue" : "MY_QUEUE"}` `{"message : "First message to be queued"}`



## License
[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) 
