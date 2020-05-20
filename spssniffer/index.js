
// Express imports
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');


let Worker = require('@senseering/worker')
let worker = new Worker();

let config = './config.json';

const server = express()
server.use(bodyParser.json({ limit: '16mb' }))
server.use(bodyParser.urlencoded({ limit: '16mb', extended: true }))
server.use(cors())
server.use(bodyParser.urlencoded({ extended: true }));

(async function () {
    await worker.connect(config)
    server.use('/', async (req, res) => {
        await worker.publish(req.body, { ttl: 60 * 60 * 1000 })
        res.status(200).send()
    });
    server.listen(3001, () => console.log(`Node listening on port 3001`))
    //await worker.disconnect()
})();


