import React from 'react';
import {DefaultMixin as RethinkMixin, QueryRequest, r} from 'react-rethinkdb';

/**
 * A list of members who can vote in the great codemocracy
 */
export const VotingMembers = React.createClass({
  mixins: [RethinkMixin],

  getInitialState() {
    return {};
  },

  observe(props, state) {
    const query = r.table('votingMembers')
                   .orderBy({index: 'joinedAt'});
    const votingMembers = new QueryRequest({query, changes: true, initial: []});
    return {votingMembers};
  },

  render() {
    return (
      <div className="votingMembers list">
        {this.data.votingMembers.value().map(votingMember => (
          <div className="votingMember" key={votingMember.id}>
            <p>{votingMember.name}: <span style={{'fontSize': 24 + 'px'}}>{votingMember.score}</span></p>
          </div>
        ))}
      </div>
    );
  },
});
