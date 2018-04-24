var request = require("request");

// CREATE TOPICS
var options = { method: 'POST',
  url: 'http://localhost:8080/topics',
  headers:
   { 'cache-control': 'no-cache',
     'content-type': 'application/json' },
  body: { name: 'home.kitchen' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  options.body.name = 'home.bedroom';
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    options.body.name = 'home.study';
    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      // SEND MESSAGES
      var options2 = { method: 'POST',
        url: 'http://localhost:8080/messages',
        headers:
         { 'cache-control': 'no-cache',
           'content-type': 'application/json' },
        body: { content: '27 ºC', topic: 'home.kitchen', publisher: 'sensor' },
        json: true };

      request(options2, function (error, response, body) {
        if (error) throw new Error(error);

        options2.body.content = '28 ºC';
        options2.body.topic = 'home.bedroom';
        options2.body.content = 'sensor';
        request(options2, function (error, response, body) {
          if (error) throw new Error(error);

          options2.body.content = '29 ºC';
          options2.body.topic = 'home.study';
          options2.body.content = 'sensor';
          request(options2, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
          });
        });
      });
    });
  });
});
