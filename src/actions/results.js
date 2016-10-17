import fetch from 'isomorphic-fetch';
import { stringify } from 'querystring';
import { isEmpty, omit, values } from '../utils/lodash';
import { buildAggResults } from './build_agg_results.js';
import { buildReports } from './build_reports.js';
import { REQUEST_RESULTS, REQUEST_AGG_RESULTS, RECEIVE_RESULTS, RECEIVE_FAILURE, PAGE_RESULTS, RECEIVE_AGG_RESULTS, SET_VISIBLE_FIELDS } from 'constants';
import config from '../config.js';

export function requestResults() {
  return {
    type: REQUEST_RESULTS,
  };
}

export function requestAggResults() {
  return {
    type: REQUEST_AGG_RESULTS,
  };
}

export function receiveResults(payload) {
  return {
    type: RECEIVE_RESULTS,
    payload,
  };
}

export function receiveFailure(error) {
  return {
    type: RECEIVE_FAILURE,
    error,
  };
}

export function pageResults(offset) {
  return {
    type: PAGE_RESULTS,
    offset,
  };
}

export function receiveAggResults(payload) {
  return {
    type: RECEIVE_AGG_RESULTS,
    payload,
  };
}

export function setVisibleFields(visible_fields){
  return {
    type: SET_VISIBLE_FIELDS,
    visible_fields,
  };
}

function aggregateResults(json, querystring, params, offset, agg_results) {
  // 10k is the max offset that can be reached in Elasticsearch:
  if(json.total >= 10000) return receiveAggResults([]);
  
  if(Object.prototype.hasOwnProperty.call(agg_results, 'results')){
    agg_results.results = buildAggResults(json.results, agg_results.results, params);
    agg_results.raw_total += json.results.length;
  }
  else{
    agg_results.results = buildAggResults(json.results, {}, params);
    agg_results.raw_total = json.results.length;
  }

  // Fetch next batch of results if needed:
  if(agg_results.raw_total < json.total){
    return fetchAggResults(querystring, params, offset+100, agg_results);
  }

  agg_results.results = buildReports(agg_results.results, params);

  return receiveAggResults(agg_results.results);
}

const { host, apiKey } = config.api.i94;
function fetchResults(querystring) {
  return (dispatch) => {
    dispatch(requestResults(querystring));
    return fetch(`${host}?api_key=${apiKey}&${querystring}`)
      .then(response => response.json())
      .then(json => dispatch(receiveResults(json)));
  };
}

function fetchAggResults(querystring, params, offset = 0, aggregated_results = {}) {
  return (dispatch) => {
    dispatch(requestAggResults(querystring));
    return fetch(`${host}?api_key=${apiKey}&size=100&offset=${offset}&${querystring}`)
      .then(response => response.json())
      .then(json => dispatch(aggregateResults(json, querystring, params, offset, aggregated_results)));
  };
}

function shouldFetchResults(state) {
  const { results } = state;
  if (!results) {
    return true;
  } else if (results.isFetching) {
    return false;
  }
  return true;
}

function buildQueryString(params) {
  if (params.start_date && params.end_date) {
    Object.assign(params, { date: params.start_date + "-01" + " TO " + params.end_date + "-01" });
  }
  return stringify(omit(params, ['start_date', 'end_date', 'percent_change', 'visible_fields', 'sort']));
}

export function fetchResultsIfNeeded(params) {
  return (dispatch, getState) => {
    if (shouldFetchResults(getState())) {
      return dispatch(fetchResults(buildQueryString(params)));
    }

    return Promise.resolve([]);
  };
}

export function fetchAggResultsIfNeeded(params) {
  return (dispatch, getState) => {
    params.sort = params.sort ? params.sort : ""
    params.percent_change = params.percent_change ? params.percent_change : ""
    if (isEmpty(omit(params, ['sort', 'offset', 'size', 'percent_change', 'visible_fields']))) {
      return dispatch(receiveAggResults([]));
    }
    else {
      return dispatch(fetchAggResults(buildQueryString(params), params, 0, {}));
    }

    return Promise.resolve([]);
  };
}
