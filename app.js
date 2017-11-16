const http = require("http")
const {
    handleQueuePush,
    handleQueuePull
} = require("./src/handler")
const port = 3000

const requestHandler = (request, response) => {
    if (request.method !== "POST") {
        response.end("Use POST request method with JSON as content type")
        return
    }
    const body = [];
    request
        .on('data', (chunk) => {
            body.push(chunk);
        })
        .on('end', () => {
            const requestBody = Buffer.concat(body).toString()
            try {
                request.body = JSON.parse(requestBody)
            } catch (error) {
                response.end("Invalid JSON request")
                return
            }
            response.setHeader('content-type', 'application/json')
            switch (request.url) {
                case "/meghduta/queue/push":
                    handleQueuePush(request, response)
                    break
                case "/meghduta/queue/pull":
                    handleQueuePull(request, response)
                    break
                default:
                    response.end("Invalid API or command")
            }
        })
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})

const wssServer = require("ws").Server
const wss = new wssServer({
    port: 3001
})

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(msg) {
        const command = /^([SP]UB) ([A-Z_]{3,20}) (.{1,262144})$/.exec(msg)
        if (!command) {
            return
        }
        const [action, topic, message] = command
        switch (action) {
            case "PUB":
                wss.clients.forEach(function each(client) {
                    if (client !== ws &&
                        client.readyState === WebSocket.OPEN &&
                        ws.topics && ws.topics.some((_topic) => topic === _topic)) {
                        client.send(message)
                    }
                })
                break
            case "SUB":
                ws.topics = ws.topics || []
                ws.topics.push(topic)
                break
        }
        console.log('received: %s', message);
    })
    ws.send('something')
})