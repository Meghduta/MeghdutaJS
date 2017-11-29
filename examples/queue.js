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
            const pushResponse = await axios.post("http://localhost:6600/meghduta/queue/push", {
                "message": "Hola",
                "queue": "my_queue"
            })
        } catch (err) {
            console.error(err)
        }
        // console.log("PUSH success")
    }

    for (let i = 0; i < count; i++) { // pull messages
        let pullResponse
        try {
            pullResponse = await axios.post("http://localhost:6600/meghduta/queue/pull", {
                "queue": "my_queue"
            })
        } catch (err) {
            console.error(err)
        }
        // console.log("PULL success " + (pullResponse.data.message === "Hola"))
    }
    console.timeEnd("Time Taken")
}


run()