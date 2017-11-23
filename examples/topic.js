'use strict'

const WebSocket = require('ws')
const subscriber = new WebSocket('ws://localhost:6610/meghduta/topic')


function printError(err) {
    if (err)
        console.error(err)
}

subscriber.on('open', function open() {
    console.log("subscriber registering")
    subscriber.send('SUB TOPIC_A', printError)
    subscriber.send('SUB TOPIC_B', printError)
    subscriber.send('SUB TOPIC_C', printError)
    console.log("subscriber registered")
})

subscriber.on('message', function incoming(data) {
    console.log("subscriber recieved data", data)
})

subscriber.on('error', function (event) {
    console.error("SUBSCRIBER ", event)
})


const publisher = new WebSocket('ws://localhost:6610/meghduta/topic')

publisher.on('open', function open() {
    setTimeout(function () {
        console.log("publishing messages")
        publisher.send('PUB TOPIC_A message1', printError)
        publisher.send('PUB TOPIC_B message2', printError)
        publisher.send('PUB TOPIC_C message3', printError)
        console.log("messages published")
    }, 1000)
})

publisher.on('error', function (event) {
    console.error("publisher ", event)
})