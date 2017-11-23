const {
    object,
    arrayOf,
    array,
    string,
    number,
    optional,
    minLength,
    maxLength,
    all,
    validate
} = require("fn-validator")

const store = require("./store")
const Queue = require("./queue")
const WebSocket = require('ws')

function validateRequest(schema, request, response) {
    const result = validate(schema, request.body)
    if (result !== true) {
        response.writeHead(400, {
            "Content-Type": "application/json"
        })
        response.end(JSON.stringify(result))
        return false
    }
    return true
}

const QueuePullSchema = object({
    queue: all([string, minLength(3), maxLength(20)])
})
const noMessagesToPull = JSON.stringify({
    message: "No messages to pull"
})

function handleQueuePull(request, response) {
    if (!validateRequest(QueuePullSchema, request, response))
        return

    const {
        queue
    } = request.body
    const message = store.queues[queue] ? store.queues[queue].pull() : null
    if (message) {
        response.end(JSON.stringify({
            message
        }))
    } else {
        response.writeHead(400, {
            "Content-Type": "application/json"
        })
        response.end(noMessagesToPull)
    }
}

const QueuePushSchema = object({
    queue: all([string, minLength(3), maxLength(20)]),
    message: all([string, minLength(1), maxLength(256 * 1024)])
})

function handleQueuePush(request, response) {
    if (!validateRequest(QueuePushSchema, request, response))
        return

    const {
        queue,
        message
    } = request.body
    store.queues[queue] = store.queues[queue] || new Queue()
    store.queues[queue].push(message)
    response.end("Message Queued")
}

const TopicPushSchema = object({
    topic: all([string, minLength(3), maxLength(20)]),
    message: all([string, minLength(1), maxLength(256 * 1024)])
})

function handleTopicPush(request, response, wss) {
    if (!validateRequest(TopicPushSchema, request, response))
        return

    const {
        topic,
        message
    } = request.body
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN &&
            client.topics && client.topics.some((_topic) => topic === _topic)) {
            client.send(message)
        }
    })
    response.end("Message Published")
}

const requestHandler = (wss) => (request, response) => {
    if (request.method === "OPTIONS") {
        response.setHeader('Access-Control-Allow-Origin', '*')
        response.setHeader('Access-Control-Allow-Methods', 'POST')
        response.setHeader('Access-Control-Allow-Headers', 'content-type')
        response.end()
        return
    } else if (request.method !== "POST") {
        response.end("Use POST request method with JSON as content type")
        return
    } else {
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
}

function handleWebSocketRequests(wss) {
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(msg) {
            const command = /^(?:(PUB) ([A-Z_]{3,20}) (.{1,262144})|(SUB) ([A-Z_]{3,20}))$/.exec(msg)
            if (!command) {
                return
            }
            const [action, topic, message] = command.filter((el) => el).slice(1)
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
        })
    })
}

module.exports = {
    requestHandler,
    handleWebSocketRequests
}