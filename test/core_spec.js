import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic:', () => {

  describe('setEntries', () => {

    it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('Trainspotting', '28 Days Later');
      const nextState = setEntries(state, {entries});
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later'];
      const nextState = setEntries(state, {entries});
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });

  });

  describe('next', () => {

    it('sets the vote to a pair of the first two entries', () => {
      const state = fromJS({
        entries: ['Trainspotting', '28 Days Later', 'Sunshine']
      });
      const nextState = next(state);
      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later']
        },
        entries: ['Sunshine']
      }));
    });

    it('sets the vote to a pair of the next two entries', () => {
      const state = fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 1,
            '28 Days Later': 0
          }
        },
        entries: ['Sunshine', 'Millions', '127 Hours']
      });
      const nextState = next(state);
      expect(nextState.get('vote')).to.equal(fromJS({
        pair: ['Sunshine', 'Millions']
      }));
    });

    it('replaces the winner at the end of entries', () => {
      const state = fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 1,
            '28 Days Later': 0
          }
        },
        entries: ['Sunshine', 'Millions', '127 Hours']
      });
      const nextState = next(state);
      expect(nextState.get('entries')).to.equal(
        List.of('127 Hours', 'Trainspotting')
      );
    });

    it('replaces both winners when there\'s a tie', () => {
      const state = fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 1,
            '28 Days Later': 1
          }
        },
        entries: ['Sunshine', 'Millions', '127 Hours']
      });
      const nextState = next(state);
      expect(nextState.get('entries')).to.equal(
        List.of('127 Hours', 'Trainspotting', '28 Days Later')
      );
    });

    it('marks the winner when no entries are left', () => {
      const state = fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 4,
            '28 Days Later': 2
          }
        },
        entries: []
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({ winner: 'Trainspotting' }));
    });

  });

  describe('vote', () => {

    it('sets the tally for a new vote', () => {
      const voteState = fromJS({
        pair: ['Trainspotting', '28 Days Later']
      });
      const nextState = vote(voteState, {votedFor: 'Trainspotting'});
      expect(nextState).to.equal(fromJS({
        pair: ['Trainspotting', '28 Days Later'],
        tally: {
          'Trainspotting': 1
        }
      }));
    });

    it('increments the tally for an existing vote', () => {
      const voteState = fromJS({
        pair: ['Trainspotting', '28 Days Later'],
        tally: {
          'Trainspotting': 1,
          '28 Days Later': 1
        }
      });
      const nextState = vote(voteState, {votedFor: 'Trainspotting'});
      expect(nextState).to.equal(fromJS({
        pair: ['Trainspotting', '28 Days Later'],
        tally: {
          'Trainspotting': 2,
          '28 Days Later': 1
        }
      }));
    });

  });

});
