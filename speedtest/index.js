const speedTest = require('speedtest-net');
let Worker = require('../../worker_js');
const debug = require("debug")("speedtest");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

let speed_test = new Worker()
let config = './config.json';
let options = './options.json';

(async () => {
  try{
    await speedTest(options)
  } catch (err) {
    debug(err.message)
  }

  let data  
  do {
    try {
      debug("Performing Speedtest")
      data = await speedTest()
      debug("Data:")
      debug(data)
      debug("Building data packet")
      delete data.timestamp
      if (data.packetLoss === undefined){
        debug("Setting Packet Loss to 0")
        data.packetLoss = 0
      }
      debug("Connecting to manager")
      await speed_test.connect(config)

      debug("Publishing data")
      await speed_test.publish(data, {price: 0})
      debug("Disconneting from manager")
      await speed_test.disconnect()
      debug("Next test starting in 10 minutes")
      await sleep(1000*60*10)
    } catch (err) {
      debug(err.message);
    }      
  } while (true)

}

)();