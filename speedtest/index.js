let Worker = require('../../worker_js')
const { Parser } = require('json2csv');
 
const fields = ['msg', 'error', 'time'];
const opts = { fields };
const fs = require('fs').promises

let config = './config.json';
const uniqid = require('uniqid')
const id = uniqid()
let workerConfig = require('./config.json')

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

    fs.appendFile('./report_' + workerConfig.credentials.split('-')[0] + '_' + id + '.csv', '"msg","error","time"\n')

    const parser = new Parser({header: false, eol: '\n'});

    while (true) {
        let startAll = Date.now();
        test.Timestamp = Date.now() / 1000

        
        let error = {
            isError: false,
            msg: '',
        }
        let start = Date.now();
        try{
            await worker.publish(test, {ttl: 1000 * 60 * 60 * 24})
        }catch(err){
            error.isError = true
            error.msg = err.msg
        }
        let end = Date.now();

        let csv = parser.parse({
            error: error.isError,
            msg: error.msg,
            time: end - start,
        });
        fs.appendFile('./report_' + workerConfig.credentials.split('-')[0] + '_' + id + '.csv', csv + '\n')


        let endAll = Date.now();
        await sleep(1000 - (endAll - startAll))
    }
})();


