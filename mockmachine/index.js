let Worker = require('../../worker_js')

let config = './config.json';

let worker = new Worker();

(async function () {
    await worker.connect(config)
    let test = {
        "Quality": (100 - Math.random() * 25),
        "Avg_Force": (0.7 - Math.random() * 0.2),
        "Max_Force": (1.3 - Math.random() * 0.6),
        "Avg_Temperature": (250 - Math.random() * 50),
        "Max_Temperature": (350 - Math.random() * 100),
        "Avg_Frequency": (800 - Math.random() * 100),
        "Max_Frequency": (1200 - Math.random() * 400),
        "Power_Anomaly": (Math.random() < 0.5) ? 1 : 0,
        "Heat_Anomaly": (Math.random() < 0.5) ? 1 : 0
    };
    while (true) {
        test.Quality += ((Math.random() - 0.5) * 25)
        test.Avg_Force += ((Math.random() - 0.5) * 0.2)
        test.Max_Force += ((Math.random() - 0.5) * 25)
        test.Avg_Temperature += ((Math.random() - 0.5) * 50)
        test.Max_Temperature += ((Math.random() - 0.5) * 100)
        test.Avg_Frequency += ((Math.random() - 0.5) * 100)
        test.Max_Frequency += ((Math.random() - 0.5) * 50)
        test.Power_Anomaly = (Math.random() < 0.5) ? 1 : 0
        test.Heat_Anomaly = (Math.random() < 0.5) ? 1 : 0
        await worker.publish(test)

    }
})();


