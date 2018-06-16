const rabbitAPI = require('../../config/rabbit');
const request = require('request-promise');
const Message = require('../models/message.model');

const getQueueBindings = (queue, callback) => {
    rabbitAPI.getQueueBindings({
        vhost: 'vhost',
        exchange: 'source',
        queue: queue
    }, function (err, response) {
        if (err) {
            throw(err);
        } else {
            const aux = JSON.parse(response);
            callback(aux.filter(x => x.source !== ''));
        }
    });
}

const createQueueBinding = async (queue, binding) => {
    try {
        await request.post({
            headers: {
                'content-type': 'application/json'
            },
            url: 'http://guest:guest@rabbitmq:15672/api/bindings/vhost/e/source/q/' + queue,
            json: {
                "routing_key": binding,
                "source": 'source',
            }
        })
    } catch(e) {
        throw(e);
    }
}

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
                getQueueBindings(element.name, function(bindings) {
                    data.push({ ...element, bindings });
                    if(data.length === queues.length) {
                        res.ok(data);
                    }
                })
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
        getQueueBindings(name, function(bindings) {
            queue.bindings = bindings;
            res.ok(queue);
        })
    });
};

const create = (req, res) => {
    let queue = req.body.name;

    rabbitAPI.createQueue({
        vhost: 'vhost',
        queue: queue,
        auto_delete: false,
        durable: true,
        arguments: {},
    }, async function (err, response) {
        if (err) return res.internalServerError(err);
        try {
            await createQueueBinding(queue, `${queue}.#`);
            const bindings = req.body.bindings;
            bindings.forEach(async x => {
                await createQueueBinding(queue, x);
            })
            rabbitAPI.getQueue({
                vhost: 'vhost',
                queue: queue
            }, function (err, response) {
                let aux = JSON.parse(response);
                if (err) return res.internalServerError(err);
                getQueueBindings(queue, function(bindings) {
                    aux.bindings = bindings;
                    res.ok(aux);
                })
            });
        } catch(e) {
            throw(e)
        }
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
        res.ok([]);
    });
};

const queueConsumers = (req, res) => {
  let queue = req.params.id;

  rabbitAPI.getQueue({
      vhost: 'vhost',
      queue: queue
  }, function (err, response) {
      if (err) return res.internalServerError(err);
      else{
        let queueDetails = JSON.parse(response);
        res.ok(queueDetails.consumer_details.map(c => c.consumer_tag));
      }
  });
};

const addBinding = async (req, res) => {
    const queue = req.params.queueId;
    const binding = req.params.bindingId;
    try {
        await createQueueBinding(queue, binding);
        res.ok();
    } catch(e) {
        throw(e);
    }
};

const removeBinding = async (req, res) => {
    const queue = req.params.queueId;
    const binding = encodeURIComponent(req.params.bindingId);
    request.delete({
        headers: {
            'content-type': 'application/json'
        },
        url: `http://guest:guest@rabbitmq:15672/api/bindings/vhost/e/source/q/${queue}/${binding}`,
    }, function (error, response, body) {
        if (error) return res.internalServerError(error);
        else res.ok(response);
    });
};

module.exports = {
    index,
    show,
    create,
    destroy,
    queueMessages,
    queueConsumers,
    addBinding,
    removeBinding
}
