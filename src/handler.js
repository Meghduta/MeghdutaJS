const store = require('./store')
const Queue = require('./queue')
const WebSocket = require('ws')
const {
    ContentTypeHeader,
    validateRequest,
    QueuePullSchema,
    QueuePushSchema,
    TopicPushSchema,
    noMessagesToPull,
    getRequestData
} = require('./common')

async function handleQueuePull(request, response) {
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
        response.end(noMessagesToPull)
    }
}

function handleQueuePush(request, response) {
    if (!validateRequest(QueuePushSchema, request, response))
        return

    const {
        queue,
        message
    } = request.body
    store.queues[queue] = store.queues[queue] || new Queue()
    store.queues[queue].push(message)
    response.end('Message Queued')
}

function handleTopicPublish(request, response, wss) {
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
    response.end('Message Published')
}

const requestHandler = (wss) => async(request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'POST')
    response.setHeader('Access-Control-Allow-Headers', 'content-type')
    if (request.method === 'OPTIONS') {
        response.end()
        return
    } else if (request.method !== 'POST') {
        response.end('Use POST request method with JSON as content type')
        return
    } else {
        const requestBody = await getRequestData(request)
        try {
            request.body = JSON.parse(requestBody)
        } catch (error) {
            response.end('Invalid JSON request')
            return
        }
        response.setHeader('content-type', 'application/json')
        switch (request.url) {
            case '/meghduta/queue/push':
                handleQueuePush(request, response)
                break
            case '/meghduta/queue/pull':
                handleQueuePull(request, response)
                break
            case '/meghduta/topic/publish':
                handleTopicPublish(request, response, wss)
                break
            default:
                response.writeHead(404, ContentTypeHeader)
                response.end('Invalid API or command')
        }
    }
}

function handleWebSocketRequests(wss) {
    const commandRegex = /^(?:(PUB) ([A-Z_]{3,20}) (.{1,262144})|(SUB) ([A-Z_]{3,20}))$/
    const urlPrefix = '/meghduta/topic'
    const identity = (id) => id

    wss.on('connection', function connection(ws, request) {
        if (request.url.slice(-15) !== urlPrefix) {
            ws.close()
            return
        }
        ws.isAlive = true
        ws.on('pong', function heartbeat() {
            this.isAlive = true
        })
        ws.on('message', function incoming(msg) {
            const command = commandRegex.exec(msg)
            if (!command) {
                return
            }
            const [action, topic, message] = command.filter(identity).slice(1)
            switch (action) {
                case 'PUB':
                    wss.clients.forEach(function each(client) {
                        if (client !== ws &&
                            client.readyState === WebSocket.OPEN &&
                            ws.topics && ws.topics.some((_topic) => topic === _topic)) {
                            client.send(message)
                        }
                    })
                    break
                case 'SUB':
                    ws.topics = ws.topics || []
                    ws.topics.push(topic)
                    break
            }
        })
        ws.ping('', false, true)
    })
}

module.exports = {
    requestHandler,
    handleWebSocketRequests
}