import {List, Map, fromJS as fromJs} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic:', () => {

  describe('setEntries', () => {

    it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('Trainspotting', '28 Days Later');
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });

  });

  describe('next', () => {

    it('sets the vote to a pair of the next two entries', () => {
      const state = fromJs({
        entries: ['Trainspotting', '28 Days Later', 'Sunshine']
      });
      const nextState = next(state);
      expect(nextState).to.equal(fromJs({
        vote: {
          pair: ['Trainspotting', '28 Days Later']
        },
        entries: ['Sunshine']
      }));
    });

    it('replaces the winner at the end of entries', () => {
      const state = fromJs({
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

  });

  describe('vote', () => {

    it('sets the tally for a new vote', () => {
      const state = fromJs({
        vote: {
          pair: ['Trainspotting', '28 Days Later']
        },
        entries: []
      });
      const nextState = vote(state, 'Trainspotting');
      expect(nextState).to.equal(fromJs({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 1
          }
        },
        entries: []
      }));
    });

    it('increments the tally for an existing vote', () => {
      const state = fromJs({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 1,
            '28 Days Later': 1
          }
        },
        entries: []
      });
      const nextState = vote(state, 'Trainspotting');
      expect(nextState).to.equal(fromJs({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 2,
            '28 Days Later': 1
          }
        },
        entries: []
      }));
    });

  });

});
