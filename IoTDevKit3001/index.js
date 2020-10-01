
// Express imports
const WebSocket = require('ws');
const cors = require('cors')
const bodyParser = require('body-parser');
const fs = require('fs')


let Worker = require('../../worker_js')
let worker = new Worker();

let config = './config.json';

const wss = new WebSocket.Server({ port: 3001 });

(async function () {
    await worker.connect(config)

    wss.on('connection', async function connection(ws) {
        ws.on('message', async function incoming(message) {
            console.log('received: %s', message);
            await worker.publish(JSON.parse(message))
        });
    });
    //await worker.disconnect()
})();


