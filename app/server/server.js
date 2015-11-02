import fs from 'fs';

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

  // Cleaning up the temporary files created by hot code reloading
  const _cleanup = function(options={}) {
    const assets = fs.readdirSync('app/assets');
    const regex = /.*\.hot-update\.js(\.map)?/;
    assets.filter(function(asset) {
      return regex.test(asset);
    }).map(function(temporaryAsset) {
      fs.unlinkSync(`app/assets/${temporaryAsset}`);
    });
    if (options.exit) {
      process.exit();
    }
  };
  process.on('exit', _cleanup.bind(null));
  process.on('SIGINT', _cleanup.bind({exit: true}));
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

// Implementation of the win condition: when a player hits the target points, set them as the winner
// TODO: Redo with promises
const onWinDetected = function(winningMember) {
  console.info('Winner detected', winningMember);
};

r.connect({host: cfg.db.host, port: cfg.db.port, db: cfg.db.name}).then(function(c) {
  // Check if there is already a winner
  r.table('votingMembers').filter(
    r.row('winner').eq(true)
  ).run(c, function(err, cursor) {
    if (err) {
      return console.error('Could not determine if there is already a winner on start up');
    }
    cursor.toArray(function(err, results) {
      if (err) {
        return console.error('Could not determine if there is already a winner on start up');
      }
      if (results.length) {
        console.info('There is already a winner, not watching for another');
      } else {
        r.table('votingMembers').filter(
          r.row('score').ge(cfg.game.winningPoints)
        ).run(c, function(err, cursor) {
          if (err) {
            return console.error('Could not determine if there is already a winner on start up');
          }
          cursor.toArray(function(err, results) {
            if (err) {
              return console.error('Could not determine if there is already a winner on start up');
            }
            if (results.length) {
              onWinDetected(results[0]);
            } else {
              // Nobody has won yet, start watching for changes
              // TODO
              r.table('votingMembers').filter(r.row('score').ge(cfg.game.winningPoints)).changes().run(c).then(function(cursor){
                console.log('Listening for changes to votingMembers');
                cursor.each(function(err, votingMember) {
                  onWinDetected(winningMember);
                });
              });
            }
          });
        });
      }
    });

  });

});
