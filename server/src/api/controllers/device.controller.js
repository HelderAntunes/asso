const rabbitAPI = require('../../config/rabbit');
const Device = require('../models/device.model');

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
        const response = await Device.findById(name);
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
        res.ok(name);
    })
};

const seed = (req, res) => {
    for(let i = 0; i < 10; i++) {
        const deviceNames = ['Smart Door Lock', 'Home Retrofit', 'Smart Video Doorbell', 'Smart Light', 'Wearable', 'Smoke Alarm', 'Air monitor', 'Refrigerator', 'Router', 'Smart TV'];
        const device = new Device({ name: deviceNames[Math.floor(Math.random() * deviceNames.length)] });
        device.save(function (err) {
            if (err) res.internalServerError(err);
        })
    }
    res.ok({});
};

module.exports = {
    index,
    show,
    create,
    destroy,
    seed
}