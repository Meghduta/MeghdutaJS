'use strict'

const http = require('http')
const axios = require('axios').create({
    httpAgent: new http.Agent({
        keepAlive: true
    })
})
const count = 1000

async function run() {
    console.time("Time Taken")
    for (let i = 0; i < count; i++) { // push messages
        try {
            const pushResponse = await axios.post("http://localhost:6600/meghduta/topic/publish", {
                "message": "Hola",
                "topic": "MY_TOPIC"
            })
        } catch (err) {
            console.error(err)
        }
        // console.log("PUBLISH success")
    }
    console.timeEnd("Time Taken")
}

run()