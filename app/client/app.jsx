import React from 'react';
import {VotingMembers} from './VotingMembers.jsx';

console.log('Starting the client side app');
const ReactRethinkdb = require('react-rethinkdb');
const RethinkSession = ReactRethinkdb.DefaultSession;

RethinkSession.connect({
  host: window.location.hostname,
  port: parseInt(window.location.port),
  path: '/db',
  db: 'democoderacy',
});

const mountNode = document.getElementById('app');
React.render(<VotingMembers />, mountNode);
