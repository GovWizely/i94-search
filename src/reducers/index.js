import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { results } from './results';

export default combineReducers({
  form,
  results,
});
