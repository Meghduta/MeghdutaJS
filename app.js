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