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
const WebSocket = require('ws');

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
                        // console.log(client !== ws)
                        // console.log(client.readyState === WebSocket.OPEN)
                        // console.log(ws.topics && ws.topics.some((_topic) => topic === _topic))
                        if (client !== ws &&
                            client.readyState === WebSocket.OPEN &&
                            ws.topics && ws.topics.some((_topic) => topic === _topic)) {
                            client.send(message)
                        }
                    })
                    break
                case "SUB":
                    // console.log(" subscribed")
                    // console.log(topic)
                    ws.topics = ws.topics || []
                    ws.topics.push(topic)
                    break
            }
        })
    })
}

module.exports = {
    handleQueuePull,
    handleQueuePush,
    handleTopicPush,
    handleWebSocketRequests
}