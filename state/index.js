let Worker = require('@senseering/worker')

let config = './config.json';

let worker = new Worker();

(async function () {

    let data = {
        temperature: 10.1, // in kN
        lightValue: 80.2,
        street: "nowhere"
    }
    let increment = {
        temperature: 1, // in kN
        lightValue: 0, // in dB,
        street: ""
    }

    let initalState = {
        "heater": 0.78,
        "light": false,
        "street": ""
    }
    let initalSchema = {
        "$schema": "http://json-schema.org/draft-07/schema",
        "type": "object",
        "required": [
            "heater",
            "light",
            "street"
        ],
        "properties": {
            "heater": {
                "type": "number"
            },
            "light": {
                "type": "boolean"
            },
            "street": {
                "type": "string"
            }
        }
    }

    await worker.connect(config)
    await worker.state.init(initalSchema, initalState)

    worker.state.on('change', 'heater', (topic, value) => {
        console.log("recieved state change ", topic)
        increment.temperature = value
    })
    worker.state.on('change', 'light', (topic, value) => {
        console.log("recieved state change ", topic)
        increment.lightValue = value === true ? 1 : -1
    })
    worker.state.on('change', 'street', (topic, value) => {
        console.log("recieved state change ", topic)
        increment.street = value
    })

    while (true) {
        data.temperature += increment.temperature
        data.lightValue += increment.lightValue
        data.street = increment.street
        console.log(data)
        await worker.publish(data)
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
})();