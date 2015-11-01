import React from 'react';
import Reflux from 'reflux';
import {Router, Route} from 'react-router';
import {Home} from './pages/Home.jsx';

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
React.render((
  <Router>
    <Route path="/" component={Home}/>
  </Router>
), mountNode);
