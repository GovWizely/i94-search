import 'babel-polyfill';
import { REQUEST_RESULTS, RECEIVE_RESULTS, RECEIVE_FAILURE, PAGE_RESULTS, RECEIVE_AGG_RESULTS, REQUEST_AGG_RESULTS, SET_VISIBLE_FIELDS } from 'constants';

export function results(state = {
  isFetching: false,
  isFetchingAggs: false,
  items: [],
  aggregatedItems: [],
  pageItems: [],
  offset: 0,
  invalidated: false,
  total: 0,
  visibleFields: [],
}, action) {
  switch (action.type) {
  case REQUEST_RESULTS:
    return Object.assign({}, state, {
      isFetching: true,
      invalidated: false,
    });
  case REQUEST_AGG_RESULTS:
    return Object.assign({}, state, {
      isFetchingAggs: true,
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
  case PAGE_RESULTS:
    return Object.assign({}, state, {
      offset: action.offset,
      pageItems: state.aggregatedItems.slice(action.offset, action.offset+10),
    });
  case RECEIVE_AGG_RESULTS:
    return Object.assign({}, state, {
      isFetchingAggs: false,
      invalidated: false,
      aggregatedItems: action.payload,
      offset: 0,
      pageItems: action.payload.slice(state.offset, state.offset+10),
    });
  case SET_VISIBLE_FIELDS:
    return Object.assign({}, state, {
      visibleFields: action.visible_fields.split(',')
    });
  default:
    return state;
  }
}
