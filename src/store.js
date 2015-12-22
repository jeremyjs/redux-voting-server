import {createStore} from 'redux';
import reducer from './reducer';

export default function Store() {
  return createStore(reducer);
}
