import cfg from '../app/config';
import Promise from 'bluebird';
import r from 'rethinkdb';

const connPromise = Promise.promisify(r.connect)({
  host: cfg.db.host,
  port: cfg.db.port,
  db: cfg.db.name
});
const run = q => connPromise.then(c => q.run(c));

console.log('Resetting democoderacy db...');

const recreateDb = name => run(r.dbDrop(name))
                           .catch(() => {})
                           .then(() => run(r.dbCreate(name)));

const recreateTable = name => run(r.tableDrop(name))
                              .catch(() => {})
                              .then(() => run(r.tableCreate(name)));

recreateDb(cfg.db.name).then(() => {
  recreateTable('votingMembers').then(() => {
    Promise.all([
      run(r.table('votingMembers').indexCreate('joinedAt')),
      run(r.table('votingMembers').insert([
        {name: 'Harley', score: 1, joinedAt: new Date()},
      ]))
    ]).then(() => {
      connPromise.then(c => c.close());
      console.log('Completed');
    });
  });
});
