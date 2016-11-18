import 'babel-polyfill';
import { RECEIVE_FAILURE, PAGE_RESULTS, RECEIVE_AGG_RESULTS, REQUEST_AGG_RESULTS } from 'constants';

export function results(state = {
  isFetchingAggs: false,
  aggregatedItems: [],
  pageItems: [],
  offset: 0,
  invalidated: false,
  error: ""
}, action) {
  switch (action.type) {
  case REQUEST_AGG_RESULTS:
    return Object.assign({}, state, {
      error: "",
      isFetchingAggs: true,
      invalidated: false,
    });
  case RECEIVE_FAILURE:
    return Object.assign({}, state, {
      isFetchingAggs: false,
      invalidated: false,
      error: action.error,
    });
  case PAGE_RESULTS:
    return Object.assign({}, state, {
      offset: action.offset,
      pageItems: state.aggregatedItems.slice(action.offset, action.offset+10),
    });
  case RECEIVE_AGG_RESULTS:
    return Object.assign({}, state, {
      isFetchingAggs: false,
      invalidated: false,
      aggregatedItems: action.payload.results,
      offset: 0,
      pageItems: action.payload.results.slice(state.offset, state.offset+10),
    });
  default:
    return state;
  }
}
