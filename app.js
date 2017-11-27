const http = require("http")
const {
    requestHandler,
    handleWebSocketRequests
} = require("./src/handler")

function start(httpPort = 6600, websocketPort = 6610) {
    const wssServer = require("ws").Server
    const wss = new wssServer({
        port: websocketPort
    }, function (err) {
        if (err) {
            return console.log('something bad happened', err)
        }
        console.log(`Meghduta websocket server is listening on ${websocketPort}`)
    })
    handleWebSocketRequests(wss)

    const server = http.createServer(requestHandler(wss))
    server.listen(httpPort, (err) => {
        if (err) {
            return console.log('something bad happened', err)
        }
        console.log(`Meghduta http server is listening on ${httpPort}`)
    })
}

module.exports = {
    start
}