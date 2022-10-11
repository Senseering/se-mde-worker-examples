let Worker = require('@senseering/worker')

let config = './config2.json';

let worker = new Worker();

let weights = [Math.random(), Math.random(), Math.random()];


(async function () {
    await worker.connect(config)
    let data = {
        n2o: 40 // in dB
    }
    while (true) {
        data.n2o = Math.max(Math.min(((Math.random() * 2000) * (1 - weights[0])) + (data.n2o * weights[0]), 2500), 0)
        console.log(data.n2o)
        await worker.publish(data)
        await new Promise(resolve => setTimeout(resolve, 5000))
    }
})();