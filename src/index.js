const express = require("express");

const bodyParser = require('body-parser');
const compression = require('compression');

const coins = require("./coin");
const insight = require("./insight");

const server = express();


server.use(compression());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods',
    'GET, HEAD, PUT, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, ' +
    'Content-Length, Cache-Control, cf-connecting-ip');
  var method = req.method && req.method.toUpperCase &&
    req.method.toUpperCase();
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
  } else {
    next();
  }
});

for (let key in coins) {
  const coin = coins[key];
  server.use(`/${key}`, insight(coin));
}

server.listen(8080);
