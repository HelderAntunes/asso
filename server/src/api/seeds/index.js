const request = require("request-promise");

const createTopics = async () => {
  let options = {
    method: 'POST',
    url: 'http://localhost:8080/topics',
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    body: {
      name: 'home.kitchen'
    },
    json: true
  };

  try {
    await request(options);
    options.body.name = 'home.bedroom';
    await request(options);
    options.body.name = 'home.study';
    await request(options);
  } catch (e) {
    throw new Error(error);
  }
};

const createMessages = async () => {
  let options = {
    method: 'POST',
    url: 'http://localhost:8080/messages',
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
    throw new Error(error);
  }
};

module.exports = {
  createTopics,
  createMessages
};