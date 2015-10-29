import cfg from '../config';
import http from 'http';
import express from 'express';
import r from 'rethinkdb';
const RethinkdbWebsocketServer = require('rethinkdb-websocket-server');
import Promise from 'bluebird';

// Set up a server
const app = express();

// Serve static assets (including the bundled react code) on the home route
app.use('/', express.static('app/assets'));

/************************* React Hot Loading *************************/
import httpProxy from 'http-proxy';
import bundle from './bundle.js';
if (cfg.app.environment === 'local') {
  // We require the bundler inside the if block because
  // it is only needed in a development environment. Later
  // you will see why this is a good idea

  bundle();
  const proxy = httpProxy.createProxyServer();

  // It is important to catch any errors from the proxy or the
  // server will crash. An example of this is connecting to the
  // server when webpack is bundling
  proxy.on('error', function(e) {
    console.log('Could not connect to proxy, please try again...');
  });

  // Any requests to localhost:PORT/build is proxied
  // to webpack-dev-server
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://localhost:8009'
    });
  });
}
/**********************************************************************/

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

  console.log('Democoderacy listening at http://%s:%s', host, port);
});
