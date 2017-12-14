#!/usr/bin/env node

const argv = require('optimist')
    .default({
        httpPort: 6600,
        webSocketPort: 6610,
        servers: ''
    })
    .argv
const meghduta = require('../app')

const servers = argv.servers.split(',').map((server) => server.trim())
meghduta.start(argv.httpPort, argv.webSocketPort, 'SHARED', servers)