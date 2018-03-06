'use strict'

class Queue {

    constructor() {
        this.messages = []
    }

    push(value) {
        this.messages.push(value)
        return Promise.resolve(null)
    }

    pull() {
        return Promise.resolve(this.messages.shift())
    }

}

module.exports = Queue