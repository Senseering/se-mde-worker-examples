let Worker = require('@senseering/worker')
let net = require('net')
const split = require("split")


let config = './config.json'

let published = 0 
let received = 0;
(async function () {
    //await worker.connect(config)
    let server = net.createServer(async function (socket) {
        console.log("AE Client Connected")
                
        let worker = new Worker()
        var parseStream = split("\n");

        let connectPromise =  worker.connect(config)
        console.log("Worker registered and ready to publish")
      

        socket.on('data', async (data) => {
            await connectPromise
            parseStream.write(data);
        });
        
        socket.on("close", async () => {
            await worker.disconnect()
            delete parseStream
            delete worker
            console.log("AE client disconnected and deleted")
        })


        parseStream.on('data', async function (obj) {
            try {
                let msg = JSON.parse(obj.replace(/'/g, "\""))

                received++
                await worker.publish(msg)
                published++

                console.log("published: " + published +" \t received: "+ received +"\t pending: "+ (received-published))
            } catch (err) {
                console.log(err)
            }
        })
    })

    server.listen(1337, '127.0.0.1');
})();

