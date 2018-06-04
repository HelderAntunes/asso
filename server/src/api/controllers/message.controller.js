const Message = require('../models/message.model');

const index = async (req, res) => {
    try {
        const messages = Message.find({});
        res.json(messages);
    } catch(e) {
        throw(e);
    }
};

const show = (req, res) => {
    try {
        const message = Message.findById(req.params.id);
        res.json(message);
    } catch(e) {
        throw(e);
    }
};

const create = (req, res) => {
    res.send('Sent '+ req.body.content + " to topic " + req.body.topic + " by " + req.body.publisher);
    utils.sendToBroker('proxy', req.body.topic, req.body.content, req.body.publisher);
};

module.exports = {
    index,
    show,
    create
}