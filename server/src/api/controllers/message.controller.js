const Message = require('../models/message.model');
const amqp = require('../../config/amqp');

const index = async (req, res) => {
    try {
        const messages = await Message.find({});
        res.ok(messages);
    } catch(e) {
        res.internalServerError(e);
    }
};

const show = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        res.ok(message);
    } catch(e) {
        res.internalServerError(e);
    }
};

const create = (req, res) => {
    res.ok({
        message: `Sent ${req.body.content} to topic ${req.body.topic} by ${req.body.publisher}`
    })
    amqp.sendToBroker('proxy', req.body.topic, req.body.content, req.body.publisher);
};

module.exports = {
    index,
    show,
    create
}