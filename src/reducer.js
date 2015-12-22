import {Map} from 'immutable';
import {setEntries, next, vote} from './core';

const actionMap = Map({
  'SET_ENTRIES': setEntries,
  'NEXT': next,
  'VOTE': vote,
});

export default function reducer(state, action) {
  const actionType = action.type;
  const actionFunction = actionMap.get(actionType);
  if(actionFunction == null) return state;
  const inputs = Map(action).merge({state}).toObject();
  return actionFunction(inputs);
}
