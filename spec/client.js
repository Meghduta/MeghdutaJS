const http = require('axios')

const count = 10

async function run() {
    for (let i = 0; i < count; i++) {
        try {
            const pushResponse = await http.post("http://localhost:3000/meghduta/queue/push", {
                "message": "Hola",
                "queue": "my_queue"
            })
        } catch (err) {
            console.error(err)
        }
        console.log("PUSH success")
    }

    for (let i = 0; i < count; i++) {
        try {
            const pullResponse = await http.post("http://localhost:3000/meghduta/queue/pull", {
                "queue": "my_queue"
            })
        } catch (err) {
            console.error(err)
        }
        console.log("PULL success " + (pullResponse.data.message === "Hola"))
    }

}


run()