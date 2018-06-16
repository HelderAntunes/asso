const rabbitAPI = require('../../config/rabbit');
const Device = require('../models/device.model');
const Message = require('../models/message.model');
const amqp = require('../../config/amqp');

const index = async (req, res) => {
    try {
        const response = await Device.find({});
        res.ok(response);
    } catch(e) {
        res.internalServerError(e);
    }
};

const show = async (req, res) => {
    const name = req.params.id;
    try {
        const response = await Device.findOne({ name: name });
        res.ok(response);
    } catch(e) {
        res.internalServerError(e);
    }
};

const create = (req, res) => {
    const device = new Device({ name: req.body.name });
    device.save(function (err) {
        if (err) res.internalServerError(err);
        res.ok(device);
    })
};

const destroy = (req, res) => {
    const name = req.params.id;
    Device.remove({ name }, function(err) {
        if (err) res.internalServerError(err);
        Message.remove({ publisher: name }, function(e) {
            res.ok(name);
        });
    })
};

const seed = (req, res) => {
    for(let i = 0; i < 10; i++) {
        const deviceNames = ['Smart Door Lock', 'Home Retrofit', 'Smart Video Doorbell', 'Smart Light', 'Wearable', 'Smoke Alarm', 'Air monitor', 'Refrigerator', 'Router', 'Smart TV'];
        const device = new Device({ name: deviceNames[i] });
        device.save();
    }
    res.ok({});
};

const addSubscription = async (req, res) => {
    const device = req.params.deviceId;
    let subscription = { queue: req.body.queue, topic: req.body.topic }
    amqp.consumeMessage(subscription, device.replace(/[^A-Z0-9]/ig, '_'), function(queue) {
        subscription.queue = queue;
        try {
            var conditions = {
                name: device,
                subscriptions: { $ne: subscription }
            };
    
            var update = {
                $addToSet: { subscriptions: subscription }
            }
    
            Device.findOneAndUpdate(conditions, update, function(err, doc) {
                res.ok({ queue: subscription.queue, topic: subscription.topic })
            });
        } catch(e) {
            res.internalServerError(e);
        }
    });
};
 
const removeSubscription = async (req, res) => {
    const device = req.params.deviceId;
    const subscription = { queue: req.body.queue, topic: req.body.topic }
    try {
        Device.update( {name: device}, { $pull: {subscriptions: {queue: subscription.queue, topic: subscription.topic} } },  function(err) {
            res.ok([]);
        });
    } catch(e) {
        res.internalServerError(e);
    }
};

module.exports = {
    index,
    show,
    create,
    destroy,
    seed,
    addSubscription,
    removeSubscription
}
