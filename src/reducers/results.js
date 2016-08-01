import 'babel-polyfill';
import { REQUEST_RESULTS, RECEIVE_RESULTS, RECEIVE_FAILURE } from 'constants';

export function results(state = {
  isFetching: false,
  items: [],
  invalidated: false,
  total: 0,
}, action) {
  switch (action.type) {
  case REQUEST_RESULTS:
    return Object.assign({}, state, {
      isFetching: true,
      invalidated: false,
    });
  case RECEIVE_RESULTS:
    return Object.assign({}, state, {
      isFetching: false,
      invalidated: false,
      items: action.payload.results,
      total: action.payload.total,
    });
  case RECEIVE_FAILURE:
    return Object.assign({}, state, {
      isFetching: false,
      invalidated: false,
      error: action.error,
    });
  default:
    return state;
  }
}
