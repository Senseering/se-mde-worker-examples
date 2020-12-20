let Worker = require('@senseering/worker')
const Gpio = require('onoff').Gpio;

let switch1 = new Gpio(4, 'out');
let switch2 = new Gpio(17, 'out');


let config = './config.json';

let worker = new Worker();

let publishStates = async function () {
    await worker.publish({
        "switch1": !!switch1.readSync() ? 1 : 0,
        "switch2": !!switch2.readSync() ? 1 : 0
    })
};

(async function () {
    let initalState = {
        "switch1": false,
        "switch2": false,
        "main": true
    }
    let initalSchema = {
        "$schema": "http://json-schema.org/draft-07/schema",
        "type": "object",
        "required": [
            "switch1",
            "switch2",
            "main"
        ],
        "properties": {
            "switch1": {
                "type": "boolean"
            },
            "switch2": {
                "type": "boolean"
            },
            "main": {
                "type": "boolean"
            }
        }
    }

    await worker.connect(config)
    await worker.state.init(initalSchema, initalState)

    worker.state.on('change', 'switch1', async (topic, value) => {
        try {
            await publishStates()
            console.log(`recieved message of ${topic} with value ${value}`)
            switch1.writeSync(value)
            await publishStates()
        } catch (err) {
            console.log(err)
        }

    })
    worker.state.on('change', 'switch2', async (topic, value) => {
        try {
            await publishStates()
            console.log(`recieved message of ${topic} with value ${value}`)
            switch1.writeSync(value)
            await publishStates()
        } catch (err) {
            console.log(err)
        }
    })


    worker.state.on('change', 'main', async (topic, value) => {
        await publishStates()
        console.log(`recieved message of ${topic} with value ${value}`)
        if (value) {
            switch1 = new Gpio(4, 'out');
            switch2 = new Gpio(17, 'out');
            await publishStates()
        } else {
            switch1.unexport();    // Unexport GPIO and free resources
            switch2.unexport();    // Unexport GPIO and free resources
            await publishStates()
        }
    })
})();
