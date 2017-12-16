#!/usr/bin/env node

const argv = require('optimist')
    .default({
        httpPort: 6600
    })
    .argv
console.log('httpPort', argv.httpPort)
const http = require('http')
const axios = require('axios').create({
    httpAgent: new http.Agent({
        keepAlive: true
    })
})
const count = 1000

async function run() {
    console.time('Time Taken')
    for (let i = 0; i < count; i++) { // push messages
        try {
            const pushResponse = await axios.post(`http://localhost:${argv.httpPort}/meghduta/topic/publish`, {
                'message': `Hola${i}`,
                'topic': 'MY_TOPIC'
            })
        } catch (err) {
            console.error(err)
        }
        // console.log('PUBLISH success')
    }
    console.timeEnd('Time Taken')
}

run()