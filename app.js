const http = require("http")
const {
    requestHandler,
    handleWebSocketRequests
} = require("./src/handler")

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


const server = http.createServer(requestHandler(wss))
server.listen(6600, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on 6600`)
})