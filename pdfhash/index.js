let Worker = require('@senseering/worker')
const PdfReader = require('pdfreader').PdfReader
const crypto = require('crypto')
const fs = require('fs')

let config = './config.json';

let worker = new Worker();

(async function () {
    await worker.connect(config)

    let shasum = crypto.createHash('sha256')
    let stream = fs.ReadStream('./test.pdf') //replace with correct pdf file path
    let hash = ''

    await new Promise((res, rej) => {
        stream.on('data', function (d) {
            shasum.update(d)
        })

        stream.on('end', function () {
            hash = shasum.digest('hex')
            res()
        })
    })

    console.log(hash)
    await worker.meta.update({ hash })

    await worker.publish({ hash })
})();