let Worker = require('@senseering/worker')

let config = './config.json';

let worker = new Worker();

let weights = [Math.random(), Math.random(), Math.random()];


(async function () {
    await worker.connect(config)
    let data = {
        co2: 2000, // in kN
        ch4: 80, // in dB
    }
    while (true) {
        data.co2 = Math.max(Math.min(((Math.random() * 2000) * (1 - weights[0])) + (data.co2 * weights[0]), 2500), 0)
        data.ch4 = Math.max(Math.min(((Math.random() * 80) * (1 - weights[1])) + (data.ch4 * weights[1]), 80), 0)
        console.log(data.co2)
        await worker.publish(data)
        await new Promise(resolve => setTimeout(resolve, 5000))
    }
})();