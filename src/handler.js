const {
    object,
    arrayOf,
    array,
    string,
    number,
    minLength,
    maxLength,
    all,
    validate
} = require("fn-validator")

const store = require("./store")
const Queue = require("./queue")

const QueuePullSchema = object({
    queues: arrayOf(object({
        queue: all([string, minLength(3), maxLength(20)]),
        count: number
    }))
})

function handleQueuePull(request, response) {
    const result = validate(QueuePullSchema, request.body)
    if (result !== true) {
        response.end(JSON.stringify(result, null, 2))
        return
    }
    const queues = request.body.queues
    const messages = {
        messages: []
    }
    for (const queue of queues) {
        store.queues[queue.queue] = store.queues[queue.queue] || new Queue()
        const queueMessages = {
            queue: queue.queue,
            messages: []
        }
        messages.messages.push(queueMessages)
        const queueInstance = store.queues[queue.queue]
        for (let i = 0; i < queue.count; i++) {
            const value = queueInstance.pull()
            if (value === null)
                break
            queueMessages.messages.push(value)
        }
    }
    response.end(JSON.stringify(messages))
}


const QueuePushSchema = object({
    messages: arrayOf(object({
        queue: all([string, minLength(3), maxLength(20)]),
        message: all([string, minLength(1), maxLength(256 * 1024)])
    }))
})

function handleQueuePush(request, response) {
    const result = validate(QueuePushSchema, request.body)
    if (result !== true) {
        response.end(JSON.stringify(result))
        return
    }
    const messages = request.body.messages
    for (const message of messages) {
        store.queues[message.queue] = store.queues[message.queue] || new Queue()
        store.queues[message.queue].push(message.message)
    }
    response.end("Message queued")
}

module.exports = {
    handleQueuePull,
    handleQueuePush
}