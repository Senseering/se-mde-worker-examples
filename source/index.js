let Worker = require('../../worker_js')

let config = './config.json';
let worker = new Worker();
let weights = [Math.random(), Math.random(), Math.random()];


(async function () {
    await worker.connect(config)
    let data = {
        force: 2000,    // in kN
        volume: 80,     // in dB
        ppm: 20,        // parts per Minute
    }
    while (true) {
        data.force = Math.max(Math.min(((Math.random() * 2000) * (1 - weights[0])) + (data.force * weights[0]), 2500), 0)
        data.volume = Math.max(Math.min(((Math.random() * 80) * (1 - weights[1])) + (data.volume * weights[1]), 80), 0)
        data.ppm = Math.max(Math.min(((Math.random() * 20) * (1 - weights[2])) + (data.ppm * weights[2]), 40), 0)
        await worker.publish(data)
        await new Promise(resolve => setTimeout(resolve, 15000))
    }
})();