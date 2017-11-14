'use strict'

class Queue {

    constructor() {
        this.first = null
        this.last = this.first
    }

    push(value) {
        const node = {
            value,
            prev: null
        }
        if (this.first) {
            this.first.prev = node
            this.first = node
        } else {
            this.first = node
            this.last = this.first
        }
    }

    pull() {
        const node = this.last
        if (node) {
            this.last = this.last.prev
            return node.value
        }
        return null
    }

}

module.exports = Queue