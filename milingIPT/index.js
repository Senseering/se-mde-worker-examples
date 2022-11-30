let Worker = require('../../worker_js')

let config = './config.json';

let worker = new Worker();

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


(async function () {
    await worker.connect(config)
    let test = {
        "Timestamp": Date.now() / 1000,
        "XPosition": 50,
        "YPosition": 50,
        "ZPosition": 50,
        "APosition": 50,
        "CPosition": 50,
        "SpindleEffectivePower": 10,
        "SpindleTorque": 500,
        "SpindleValue": 10
    };



    while (true) {
        await sleep(5000)
        test.Timestamp = Date.now() / 1000

        test.XPosition = Math.min(Math.max(test.XPosition + ((Math.random() - 0.5) * 2), 0), 100)
        test.YPosition = Math.min(Math.max(test.YPosition + ((Math.random() - 0.5) * 2), 0), 100)
        test.ZPosition = Math.min(Math.max(test.ZPosition + ((Math.random() - 0.5) * 2), 0), 100)
        test.APosition = Math.min(Math.max(test.APosition + ((Math.random() - 0.5) * 2), 0), 360)
        test.CPosition = Math.min(Math.max(test.CPosition + ((Math.random() - 0.5) * 2), 0), 360)

        test.SpindleEffectivePower = Math.min(Math.max(test.SpindleEffectivePower + ((Math.random() - 0.5) * 10), 0), 1000)
        test.SpindleTorque = Math.min(Math.max(test.SpindleTorque + ((Math.random() - 0.5) * 10), 0), 1000)
        test.SpindleValue = Math.min(Math.max(test.SpindleValue + ((Math.random() - 0.5) * 15), 0), 360)
        await worker.publish(test)
    }
})();


