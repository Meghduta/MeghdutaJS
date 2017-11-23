const http = require("http")
const {
    handleQueuePush,
    handleQueuePull,
    handleTopicPush,
    handleWebSocketRequests
} = require("./src/handler")

const requestHandler = (request, response) => {
    if (request.method === "OPTIONS") {
        response.setHeader('Access-Control-Allow-Origin', '*')
        response.setHeader('Access-Control-Allow-Methods', 'POST')
        response.setHeader('Access-Control-Allow-Headers', 'content-type')
        response.end()
        return
    } else if (request.method !== "POST") {
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
                case "/meghduta/topic/push":
                    handleTopicPush(request, response, wss)
                    break
                default:
                    response.end("Invalid API or command")
            }
        })
}

const server = http.createServer(requestHandler)

server.listen(6600, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on 6600`)
})

const wssServer = require("ws").Server
const wss = new wssServer({
    port: 6610
}, function (err) {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`websocket server is listening on 6610`)
})

handleWebSocketRequests(wss)