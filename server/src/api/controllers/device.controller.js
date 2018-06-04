const rabbitAPI = require('../../config/rabbit');

const index = (req, res) => {
    rabbitAPI.listQueues({
        vhost: 'vhost'
    }, function (err, response) {
        if (err) {
            res.send(err);
        } else {
            let queues = JSON.parse(response);
            let data = []

            queues.forEach(function (element) {
                rabbitAPI.getQueueBindings({
                    vhost: 'vhost',
                    queue: element.name
                }, function (err2, response2) {
                    if (err2) {
                        res.send(err2);
                    } else {
                        let bindings = JSON.parse(response2);
                        element.bindings = bindings;
                        data.push(element)

                        if (data.length == queues.length) {
                            res.send(data);
                        }
                    }
                });
            });
        }
    });
}

module.exports = {
    index,
}