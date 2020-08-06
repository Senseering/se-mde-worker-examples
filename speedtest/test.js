const speedTest = require('speedtest-net');
const debug = require("debug")("speedtest");


(async () => {

  let data_test 
  do {
    try {
      debug("Performing Speedtest")
      data_test = await speedTest()
      debug(data_test.timestamp)
      debug(typeof(data_test.timestamp))
    } catch (err) {
      debug(err.message);
      debug("This error may occur if you did not execute init.js")
      debug("Please execute init.js before executing index.js")
    }      
  } while (true)

}

)();