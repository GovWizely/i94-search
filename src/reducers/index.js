import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { results } from './results';
import { form_options } from './form_options';

export default combineReducers({
  form,
  results,
  form_options
});
