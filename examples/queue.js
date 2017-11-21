const http = require('axios')

const count = 100

async function run() {
    for (let i = 0; i < count; i++) { // push messages
        try {
            const pushResponse = await http.post("http://localhost:6600/meghduta/queue/push", {
                "message": "Hola",
                "queue": "my_queue"
            })
        } catch (err) {
            console.error(err)
        }
        console.log("PUSH success")
    }

    for (let i = 0; i < count; i++) { // pull messages
        let pullResponse
        try {
            pullResponse = await http.post("http://localhost:6600/meghduta/queue/pull", {
                "queue": "my_queue"
            })
        } catch (err) {
            console.error(err)
        }
        console.log("PULL success " + (pullResponse.data.message === "Hola"))
    }

}


run()