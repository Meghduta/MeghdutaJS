const http = require('axios')


for (let i = 0; i < 10000; i++) {
    setTimeout(function () {
        const index = i
        http.post("http://localhost:3000/meghduta/queue/push", {
            "messages": [{
                "message": "Hola",
                "queue": "my_queue"
            }]
        })
        // .then(() => console.log("PUSH success" + index))
        // .catch(() => console.error("PUSH error"))

    }, i * 10)

    setTimeout(function () {
        const index = i
        http.post("http://localhost:3000/meghduta/queue/pull", {
            "queues": [{
                "queue": "my_queue",
                "count": 1
            }]
        })
        // .then(() => console.log("PULL success" + index))
        // .catch(() => console.error("PULL error"))

    }, i * 20)
}