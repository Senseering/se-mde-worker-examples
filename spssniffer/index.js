
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
//server.use(cors())
server.use(bodyParser.urlencoded({ extended: true }));

(async function () {
    await worker.connect(config)
    server.use('/', async (req, res) => {
        let topics = req.body
        let spsdata = {}
        for (const topic of topics) {
            spsdata[topic.name.replace(/\s/g,"").replace(/\./g,"").replace(/\(/g,"").replace(/\)/g,"").replace(/\-/g,"")] = topic.valueList.map(el=>{return el.val})
        }
        res.status(200).send()
        await worker.publish(spsdata)
    });
    server.listen(3006, () => console.log(`Node listening on port 3006`))
    //await worker.disconnect()
})();


