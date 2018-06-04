const rabbitAPI = require('../../config/rabbit');
const Message = require('../models/message.model');

const index = (req, res) => {
    rabbitAPI.getBindingsForSource({
        vhost: 'vhost',
        exchange: 'proxy'
    }, function (err, response) {
        if (err) return res.send(err);
        res.send(utils.prettyJson(response));
    });
};

const show = (req, res) => {
    const destination = req.params.id;
    rabbitAPI.getQueue({
        vhost: 'vhost',
        queue: destination
    }, function (err, response) {
        if (err) return res.send(err);
        res.send(response);
    });
};

const create = (req, res) => {
    let queue_name = req.body.name;

    rabbitAPI.createQueue({
        vhost: 'vhost',
        queue: queue_name,
        auto_delete: false,
        durable: true,
        arguments: {},
    }, function (err, response_) {
        if (err) return res.send(err);

        request.post({
            headers: {
                'content-type': 'application/json'
            },
            url: 'http://guest:guest@rabbitmq:15672/api/bindings/vhost/e/proxy/q/' + queue_name,
            json: {
                "routing_key": queue_name + ".#",
                "arguments": {
                    "x-arg": "value"
                }
            }
        }, function (error, response, body) {
            if (err) return res.send(err);

            res.send(response);
        });
    });
};

const destroy = (req, res) => {
    let destination = req.params.id;

    rabbitAPI.deleteQueue({
        vhost: 'vhost',
        queue: destination
    }, function (err, response) {
        if (err) return res.send(err);
        res.send(response);
    });
};

const topicMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            topic: req.params.id
        });
        res.send(msgs);
    } catch(e) {
        throw(e);
    }
}

module.exports = {
    index,
    show,
    create,
    destroy,
    topicMessages,
}