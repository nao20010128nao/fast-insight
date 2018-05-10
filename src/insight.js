const _fetch = require("node-fetch");
const express = require("express");
const promise = require("./promise");

module.exports = function (coin) {
  const app = new express.Router();

  function routeGet(req, res) {
    console.log(req.path);
    const r = coin.explorers
      .map(ex => _fetch(ex + req.path).then(r => r.json()));
    const prom = promise.firstResolve(r);
    prom.then(res.send.bind(res))
      .catch(err => {
        res.status(500).send(err);
        console.log(err);
      });
  }
  function routePost(req, res) {
    console.log(req.path);
    const r = coin.explorers.map(ex => _fetch(ex + req.path, {
      method: 'POST',
      body: req.body
    }).then(r => r.json()));
    const prom = Promise.firstResolve(r);
    prom.then(res.send.bind(res))
      .catch(err => {
        res.status(500).send(err);
        console.log(err);
      });
  }

  app.get('/blocks', routeGet);

  app.get('/block/:blockHash', routeGet);
  app.get('/rawblock/:blockHash', routeGet);
  app.get('/block-index/:height', routeGet);
  // Transaction routes
  app.get('/tx/:txid', routeGet);
  app.get('/txs', routeGet);
  app.post('/tx/send', routePost);
  // Raw Routes
  app.get('/rawtx/:txid', routeGet);
  // Address routes
  app.get('/addr/:addr', routeGet);
  app.get('/addr/:addr/utxo', routeGet);
  app.get('/addrs/:addrs/utxo', routeGet);
  app.post('/addrs/utxo', routePost);
  app.get('/addrs/:addrs/txs', routeGet);
  app.post('/addrs/txs', routePost);
  // Address property routes
  app.get('/addr/:addr/balance', routeGet);
  app.get('/addr/:addr/totalReceived', routeGet);
  app.get('/addr/:addr/totalSent', routeGet);
  app.get('/addr/:addr/unconfirmedBalance', routeGet);
  // Status route
  app.get('/status', routeGet);
  app.get('/sync', routeGet);
  app.get('/peer', routeGet);
  app.get('/version', routeGet);
  // Address routes
  app.get('/messages/verify', routeGet);
  app.post('/messages/verify', routePost);
  return app;
}
