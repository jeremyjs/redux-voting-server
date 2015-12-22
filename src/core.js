import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries (state, {entries}) {
  return state.set('entries', List(entries));
}

export function next (state) {
  const winners = getWinners(state.get('vote'));
  const entries = state.get('entries').concat(winners);
  if(entries.size === 1) {
    return state.remove('vote')
                .remove('entries')
                .set('winner', entries.first());
  } else {
    return state.merge({
      vote: Map({ pair: entries.take(2) }),
      entries: entries.skip(2)
    });
  }
}

export function vote (state, {votedFor}) {
  return state.updateIn(['vote', 'tally', votedFor], 0, increment);
}

function getWinners (vote) {
  const tally = Map(vote).get('tally', Map());
  const tallies = Array.from(tally.values());
  const winners = Array.from(tally.filter(gtea(tallies)).keys());
  return winners;
}

const gtea = (ary) => { return (n) => ary.every(e => n >= e); }

const increment = (n) => ++n;
