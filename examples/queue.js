#!/usr/bin/env node

const argv = require('optimist')
    .default({
        httpPort: 6600
    })
    .argv

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
            const pushResponse = await axios.post(`http://localhost:${argv.httpPort}/meghduta/queue/push`, {
                'message': 'Hola',
                'queue': 'my_queue'
            })
        } catch (err) {
            console.error(err)
        }
        // console.log('PUSH success')
    }

    for (let i = 0; i < count; i++) { // pull messages
        let pullResponse = null
        try {
            pullResponse = await axios.post(`http://localhost:${argv.httpPort}/meghduta/queue/pull`, {
                'queue': 'my_queue'
            })
        } catch (err) {
            console.error(err)
        }
        // console.log('PULL success ' + (pullResponse.data.message === 'Hola'))
    }
    console.timeEnd('Time Taken')
}


run()