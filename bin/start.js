#!/usr/bin/env node

const argv = require('optimist')
    .default({
        httpPort: 6600,
        webSocketPort: 6610
    })
    .argv
const meghduta = require('../app')

meghduta.start(argv.httpPort, argv.webSocketPort)