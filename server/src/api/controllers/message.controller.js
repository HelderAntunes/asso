const request = require('request-promise');
const Message = require('../models/message.model');
const amqp = require('../../config/amqp');

const index = async (req, res) => {
    try {
        console.log(req.query);
        const messages = await Message.find(req.query);
        res.ok(messages);
    } catch (e) {
        res.internalServerError(e);
    }
};

const show = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        res.ok(message);
    } catch (e) {
        res.internalServerError(e);
    }
};

const create = async (req, res) => {
    const message = new Message({ ...req.body });
    message.save(function (err) {
        if (err) res.internalServerError(err);
        else {
            res.ok(message);
            amqp.publishToProxy(message);
        }
    })
};

const destroy = (req, res) => {
    const id = req.params.id;
    Message.remove({ _id: id }, function(err) {
        if (err) res.internalServerError(err);
        res.ok(id);
    })
};

const seed = async (req, res) => {
    let options = {
        method: 'POST',
        url: 'http://localhost:8080/api/messages',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
        },
        body: {
            content: '27 ºC',
            topic: 'home.kitchen',
            publisher: 'sensor'
        },
        json: true
    };

    try {
        await request(options);
        options.body.content = '28 ºC';
        options.body.topic = 'home.bedroom';
        await request(options);
        options.body.content = '29 ºC';
        options.body.topic = 'home.study';
        await request(options);
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = {
    index,
    show,
    create,
    seed,
    destroy
}