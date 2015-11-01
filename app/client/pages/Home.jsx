import React from 'react';
import {VotingMembers} from '../components/VotingMembers.jsx';

export const Home = React.createClass({
  render() {
    return (
      <main>
        <h1>Democoderacy</h1>
        <VotingMembers />
      </main>
    );
  }
});
