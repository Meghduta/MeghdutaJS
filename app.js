const http = require('http')

function start(httpPort = 6600, websocketPort = 6610, strategy = 'STANDALONE', servers = []) {
    const wssServer = require('ws').Server
    const wss = new wssServer({
        port: websocketPort
    }, function (err) {
        if (err) {
            return console.log('something bad happened', err)
        }
        console.log(`Meghduta websocket server is listening on ${websocketPort}`)
    })

    console.log('Server Mode:', strategy)

    const {
        requestHandler,
        handleWebSocketRequests
    } = strategy === 'SHARED' ? require('./src/sharedHandler') : require('./src/handler')

    handleWebSocketRequests(wss, servers)

    const server = http.createServer(requestHandler(wss, servers))
    server.listen(httpPort, (err) => {
        if (err) {
            return console.log('something bad happened', err)
        }
        console.log(`Meghduta http server is listening on ${httpPort}`)
    })
    server.on('connection', function (socket) {
        socket.setKeepAlive(true)
    })

    setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false)
                return ws.terminate()
            ws.isAlive = false
            ws.ping('', false, true)
        })
    }, 15000)
}

module.exports = {
    start
}