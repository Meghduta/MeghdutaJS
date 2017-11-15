'use strict'

class Queue {

    constructor() {
        this.messages = []
    }

    push(value) {
        this.messages.push(value)
    }

    pull() {
        return this.messages.shift()
    }

}

module.exports = Queue