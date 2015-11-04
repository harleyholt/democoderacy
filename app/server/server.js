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
if (cfg.app.hotReload) {
  const hotReload = require('./dev/hotReload');
  hotReload(app, cfg.app.hotReload.host, cfg.app.hotReload.port);
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
// Implemented by using the rethinkdb changefeed functionality

// Before watching for a winner, make sure the game isn't over already
r.connect({host: cfg.db.host, port: cfg.db.port, db: cfg.db.name}).then(function(c) {
  return r.table('votingMembers').filter(r.row('winner').eq(true)).run(c)
    .then(function(cursor) {
      return cursor.toArray();
    })
    .then(function(winners) {
      if (winners.length) {
        console.info('There is already a winner, not watching for another');
      } else {
        // No winners yet, start monitoring for winners
        detectWinner(c);
      }
    })
    .error(function(err) {
      console.warn('Could not detect if there was a winner or listen for the winner. Might want to fix this.', err);
    });
});

// Called to start observing for a winner
const detectWinner = function(dbConn) {
  r.table('votingMembers').orderBy({index: 'joinedAt'}).filter(r.row('score').ge(cfg.game.winningPoints)).limit(1).changes().run(dbConn)
    .then(function(cursor) {
      console.info('Listening for changes to votingMembers');
      cursor.each(function(err, update){
        if (err) {
          console.error('There was an error while listening for the winner', err);
        }
        if (update.new_val) {
          onWinDetected(update.new_val);
        }
      });
    });
};

// Called when the winner
const onWinDetected = function(winningMember) {
  console.info('Winner detected', winningMember);
};
