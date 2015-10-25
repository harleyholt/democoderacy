import cfg from '../config';
import http from 'http';
import express from 'express';
import r from 'rethinkdb';
const RethinkdbWebsocketServer = require('rethinkdb-websocket-server');
import Promise from 'bluebird';

// Open a connection to the database
// Note this is a  promise and any callers should use dbConnPromise.then to act on it
// const dbConnPromise = Promise.promisify(r.connect)(cfg.db);

// Set up a server
const app = express();

// Serve static assets (including the bundled react code) on the home route
app.use('/', express.static('app/assets'));

// The webserver includes both the express app and the Rethink proxy which allows the
// clients to make queries against the database.
const webserver = http.createServer(app);
console.log('Starting with database config', cfg.db);
RethinkdbWebsocketServer.listen({
  httpServer: webserver,
  httpPath: '/db',
  dbHost: cfg.db.host,
  dbPort: cfg.db.port,
  unsafelyAllowAnyQuery: true,
});

webserver.listen(cfg.app.port, function() {
  let host = webserver.address().address;
  let port = webserver.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
  console.log('Edited again');
  console.log('Once more');
});
