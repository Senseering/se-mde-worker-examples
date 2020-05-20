let Worker = require('@senseering/worker')

let config = './config.json'

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

let worker = new Worker();

(async function () {
    await worker.connect(config)

    let data = { test: 'Hello world!' }
    await worker.publish({ data: data, price: 0 })
    await worker.disconnect()

    await Sleep(10000)

    await worker.connect()
    await worker.publish({ data: data, price: 0 })
    await worker.disconnect()
})();