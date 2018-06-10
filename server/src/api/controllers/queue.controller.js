const rabbitAPI = require('../../config/rabbit');
const request = require('request');
const Message = require('../models/message.model');

const index = (req, res) => {
    rabbitAPI.listQueues({
        vhost: 'vhost'
    }, function (err, response) {
        if (err) {
            res.internalServerError(err);
        } else {
            let queues = JSON.parse(response);
            let data = []

            queues.forEach(function (element) {
                rabbitAPI.getQueueBindings({
                    vhost: 'vhost',
                    queue: element.name
                }, function (err2, response2) {
                    if (err2) {
                        res.json(err2);
                    } else {
                        let bindings = JSON.parse(response2);
                        element.bindings = bindings;
                        data.push(element);
                        if (data.length == queues.length) {
                            res.ok(data);
                        }
                    }
                });
            });
        }
    });
};

const show = (req, res) => {
    const name = req.params.id;
    rabbitAPI.getQueue({
        vhost: 'vhost',
        queue: name
    }, function (err, response) {
        let queue = JSON.parse(response);
        if (err) return res.internalServerError(err);
        rabbitAPI.getQueueBindings({
            vhost: 'vhost',
            queue: name
        }, function (err2, response2) {
            if (err2) {
                res.json(err2);
            } else {
                let bindings = JSON.parse(response2);
                queue.bindings = bindings;
                res.ok(queue);
            }
        });
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
        if (err) return res.internalServerError(err);

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
            if (err) return res.internalServerError(err);
            else res.ok(response);
        });
    });
};

const destroy = (req, res) => {
    let queue = req.params.id;

    rabbitAPI.deleteQueue({
        vhost: 'vhost',
        queue: queue
    }, function (err, response) {
        if (err) return res.internalServerError(err);
        else res.ok(response);
    });
};

const queueMessages = (req, res) => {
    let queue = req.params.id;
    rabbitAPI.getMessages({
        vhost : 'vhost',
        queue : queue,
        count : 5,
        requeue : true,
        encoding : "auto",
        truncate : 50000
    }, function (err, response) {
        if (err) return res.internalServerError(err);
        else res.ok(response);
    });
};

const queueBindings = (req, res) => {
    let queue = req.params.id;
    rabbitAPI.getQueueBindings({
        vhost : 'vhost',
        queue : queue
    }, function (err, response) {
        if (err) return res.internalServerError(err);
        else res.ok(response);
    });
};

const queueConsumers = (req, res) => {
    res.ok([]);
};

const addBinding = async (req, res) => {
    const queue = req.params.queueId;
    const binding = req.params.bindingId;
    request.post({
        headers: {
            'content-type': 'application/json'
        },
        url: 'http://guest:guest@rabbitmq:15672/api/bindings/vhost/e/proxy/q/' + queue,
        json: {
            "routing_key": binding,
        }
    }, function (error, response, body) {
        if (err) return res.internalServerError(err);
        else res.ok(response);
    });
};

const removeBinding = async (req, res) => {
    const queue = req.params.queueId;
    const binding = req.params.bindingId;
    request.delete({
        headers: {
            'content-type': 'application/json'
        },
        url: 'http://guest:guest@rabbitmq:15672/api/bindings/vhost/e/proxy/q/' + queue + '/' + binding,
    }, function (error, response, body) {
        if (err) return res.internalServerError(err);
        else res.ok(response);
    });
};

const seed = (req, res) => {
    for(let i = 0; i < 10; i++) {
        const queueNames = ['bedroom', 'kitchen', 'car', 'classroom', 'laboratory'];
        rabbitAPI.createQueue({
            vhost : 'vhost',
            queue : queueNames[Math.floor(Math.random() * queueNames.length)],
            auto_delete : false,
            durable : true,
            arguments : {},
        }, function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });
    }
    res.ok({});
};

module.exports = {
    index,
    show,
    create,
    destroy,
    queueMessages,
    queueBindings,
    queueConsumers,
    seed,
    addBinding,
    removeBinding
}