import {Map} from 'immutable';
import {setEntries, next, vote, INITIAL_STATE} from './core';

const actionMap = Map({
  'SET_ENTRIES': setEntries,
  'NEXT': next,
  'VOTE': (state, action) => {
    return state.update('vote', voteState => vote(voteState, action));
  }
});

export default function reducer(state = INITIAL_STATE, action) {
  const actionType = action.type;
  const actionFunction = actionMap.get(actionType);
  if(actionFunction == null) return state;
  return actionFunction(state, action);
}
