(async () => {
    let options = './options.json'
    let data   
    try {
        debug("Agreeing to terms")
        data = await speedTest(options)
        debug("Initialization succesfull")
    } catch (err) {
        debug(err.message);
    }         
  }
)();