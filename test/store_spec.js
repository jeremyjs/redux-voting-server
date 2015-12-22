import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import createStore from '../src/store';

describe('store', () => {

  it('dispatches SET_ENTRIES', () => {
    const store = createStore();
    expect(store.getState()).to.equal(Map());

    store.dispatch({
      type: 'SET_ENTRIES',
      entries: ['Trainspotting', '28 Days Later']
    });
    expect(store.getState()).to.equal(fromJS({
      entries: ['Trainspotting', '28 Days Later']
    }));
  });

});
