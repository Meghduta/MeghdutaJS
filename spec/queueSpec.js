'use strict'

describe("Queue", () => {

    const Queue = require("../src/queue")
    let queue = null

    beforeAll(() => {
        queue = new Queue()
    })

    it("should push and pull elements", function () {
        queue.push("Hello")
        queue.push("World")
        expect(queue.pull()).toEqual("Hello")
        expect(queue.pull()).toEqual("World")
        expect(queue.pull()).toEqual(null)
    })
})