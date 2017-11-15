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

const QueuePullSchema = object({
    queue: all([string, minLength(3), maxLength(20)])
})

function handleQueuePull(request, response) {
    const result = validate(QueuePullSchema, request.body)
    if (result !== true) {
        response.writeHead(400, {
            "Content-Type": "application/json"
        })
        response.end(JSON.stringify(result))
        return
    }
    const queue = request.body
    const message = store.queues[queue.queue] ? store.queues[queue.queue].pull() : null
    if (message) {
        response.end(JSON.stringify({
            message
        }))
    } else {
        response.writeHead(400, {
            "Content-Type": "text/plain"
        })
        response.end("No messages to pull")
    }
}


const QueuePushSchema = object({
    queue: all([string, minLength(3), maxLength(20)]),
    message: all([string, minLength(1), maxLength(256 * 1024)])
})

function handleQueuePush(request, response) {
    const result = validate(QueuePushSchema, request.body)
    if (result !== true) {
        response.writeHead(400, {
            "Content-Type": "application/json"
        })
        response.end(JSON.stringify(result))
        return
    }
    const message = request.body
    store.queues[message.queue] = store.queues[message.queue] || new Queue()
    store.queues[message.queue].push(message.message)
    response.end("Message Queued")
}

module.exports = {
    handleQueuePull,
    handleQueuePush
}