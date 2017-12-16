const {
    object,
    string,
    minLength,
    maxLength,
    all,
    validate
} = require('fn-validator')


const ContentTypeHeader = {
    'Content-Type': 'application/json'
}

const QueuePullSchema = object({
    queue: all([string, minLength(3), maxLength(20)])
})

const noMessagesToPull = JSON.stringify({
    message: null
})

const QueuePushSchema = object({
    queue: all([string, minLength(3), maxLength(20)]),
    message: all([string, minLength(1), maxLength(256 * 1024)])
})

const TopicPushSchema = object({
    topic: all([string, minLength(3), maxLength(20)]),
    message: all([string, minLength(1), maxLength(256 * 1024)])
})

function getRequestData(request) {
    return new Promise(function (resolve, reject) {
        const body = []
        request
            .on('data', (chunk) => {
                body.push(chunk)
            })
            .on('end', () => {
                resolve(Buffer.concat(body).toString())
            })
            .on('error', (error) => {
                reject(error)
            })
    })
}

function validateRequest(schema, request, response) {
    const result = validate(schema, request.body)
    if (result !== true) {
        response.writeHead(400, ContentTypeHeader)
        response.end(JSON.stringify(result))
        return false
    }
    return true
}

module.exports = {
    getRequestData,
    validateRequest,
    QueuePullSchema,
    QueuePushSchema,
    TopicPushSchema,
    noMessagesToPull,
    ContentTypeHeader
}