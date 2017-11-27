'use strict'

const http = require('axios')
const count = 100

async function run() {
    for (let i = 0; i < count; i++) { // push messages
        try {
            const pushResponse = await http.post("http://localhost:6600/meghduta/topic/publish", {
                "message": "Hola",
                "topic": "MY_TOPIC"
            })
        } catch (err) {
            console.error(err)
        }
        console.log("PUSH success")
    }
}

run()