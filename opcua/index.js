const opcua = require('node-opcua')
const channels = require('./env/opcua/channels.json')
const opcuaConfig = require('./env/opcua/config.json')

let Worker = require('@senseering/worker')
let worker = new Worker()
let config = `${workdir}/config.json`

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

(async function () {
    let data = {}
    for (var channel of Object.keys(channels)) {
        data[channel] = 0
    }
    let mappingTable = {}
    for (var channel of Object.keys(channels)) {
        mappingTable[channels[channel].split(';s=')[1]] = channel
    }

    await worker.connect(config)

    const client = opcua.OPCUAClient.create({
        securityMode: opcuaConfig.securityMode,
        securityPolicy: opcuaConfig.securityPolicy,
        keepSessionAlive: true,
        endpoint_must_exist: false
    })

    client.on('backoff', () => console.log('Backoff: trying to conncect to ', opcuaConfig.endpointUri))

    await client.connect(opcuaConfig.endpointUri)
    let session = await client.createSession({ userName: opcuaConfig.userName, password: opcuaConfig.password })
    console.log('Connection to OPC-UA-Server established')

    console.log('Subscribing to channels')
    let subscription = opcua.ClientSubscription.create(session, {
        requestedPublishingInterval: 100,
        requestedLifetimeCount: 100,
        requestedMaxKeepAliveCount: 10,
        maxNotificationsPerPublish: 500,
        publishingEnabled: true,
        priority: 6
    })

    subscription.on("started", function () {
        console.log("subscription started for 2 seconds - subscriptionId=", subscription.subscriptionId)
    }).on("keepalive", function () {
        console.log("keepalive")
    }).on("terminated", function () {
        console.log("terminated")
    })


    // install monitored item
    for (var channel of Object.keys(channels)) {
        let itemToMonitor = {
            nodeId: channels[channel],
            attributeId: opcua.AttributeIds.Value
        }
        let parameters = {
            samplingInterval: 200,
            discardOldest: true,
            queueSize: 200
        }

        subscription.monitor(
            itemToMonitor,
            parameters,
            opcua.TimestampsToReturn.Both,
            (err, monitoredItem) => {
                monitoredItem.on("changed", function (dataValue) {
                    let channel = mappingTable[monitoredItem.itemToMonitor.nodeId.value]
                    if (dataValue.value.toJSON().dataType === 'UInt32') {
                        let buffer = Buffer.allocUnsafe(4)
                        buffer.writeUInt32BE(dataValue.value.value, 0)
                        data[channel] = buffer.readFloatBE()
                    } else if (dataValue.value.toJSON().dataType === 'UInt16') {
                        let buffer = Buffer.allocUnsafe(4)
                        buffer.writeUInt16BE(dataValue.value.value, 0)
                        data[channel] = buffer.readFloatBE()
                    } else {
                        data[channel] = dataValue.value.value
                    }
                    worker.publish(data)
                })
            }
        )
    }

    while (true) {
        await timeout(1000)
    }

})();