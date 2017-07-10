import fetch from 'isomorphic-fetch';
import { stringify } from 'querystring';
import { isEmpty, omit, values, has } from '../utils/lodash';
import { buildAggResults } from './build_agg_results.js';
import { buildReports } from './build_reports.js';
import { REQUEST_AGG_RESULTS, RECEIVE_FAILURE, PAGE_RESULTS, RECEIVE_AGG_RESULTS } from '../constants';
import config from '../config.js';
import moment from 'moment';

export function requestAggResults() {
  return {
    type: REQUEST_AGG_RESULTS,
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

function aggregateResults(json, querystring, params, offset, agg_results) {
  console.log(json)
  // 10k is the max offset that can be reached in Elasticsearch for now:
  //if(json.total >= 10000) return receiveAggResults({results: []});
  if(json.total >= 10000) return receiveFailure('Too many results; enter fewer countries, world regions, or groups to limit the number of reports.');
  
  agg_results.results = buildAggResults(json.results, agg_results.results);
  agg_results.total += json.results.length;
  // Fetch next batch of results if needed:
  if(agg_results.total < json.total)
    return fetchAggResults(querystring, params, offset+100, agg_results);
  
  agg_results.results = buildReports(agg_results.results, params);

  return receiveAggResults(agg_results);
}

const { host, apiKey } = config.api.i94;
function fetchAggResults(querystring, params, offset = 0, aggregated_results = {}) {
  return (dispatch) => {
    dispatch(requestAggResults(querystring));
    return fetch(`${host}?api_key=${apiKey}&size=100&offset=${offset}&${querystring}`)
      .then(response => response.json())
      .then(json => dispatch(aggregateResults(json, querystring, params, offset, aggregated_results)))
      .catch((error) => {
        dispatch(receiveFailure('There was an error retrieving results from the data source.'));
      });;
  };
}

function shouldFetchResults(state) {
  const { results } = state;
  if (!results) {
    return true;
  } else if (results.isFetchingAggs) {
    return false;
  }
  return true;
}

export function fetchAggResultsIfNeeded(params) {
  return (dispatch, getState) => {
    params.percent_change = params.percent_change ? params.percent_change : ""
    if (isEmpty(omit(params, ['offset', 'size', 'percent_change', 'select_options'])))
      return dispatch(receiveAggResults({results: []})); // Don't return anything if no query is entered
    if(shouldFetchResults(getState())){
      const agg_results = {results: [], total: 0}
      return dispatch(fetchAggResults(buildQueryString(params), params, 0, agg_results));
    }

    return Promise.resolve([]);
  };
}

function buildQueryString(params) {
  params = filterSelectValues(params);

  if (params.start_date && params.percent_change) {
    const date_range = calculateDateRange(moment(params.start_date), params.percent_change);
    Object.assign(params, { date: date_range });
  }
  return stringify(omit(params, ['start_date', 'percent_change', 'select_options']));
}

function filterSelectValues(params) {
  if (params.select_options == 'countries'){
    params.world_regions = '';
    params.ntto_groups = '';
  }
  else if (params.select_options == 'worldRegions'){
    params.countries = '';
    params.ntto_groups = '';
  }
  else if (params.select_options == 'nttoGroups'){
    params.world_regions = '';
    params.countries = '';
  }
  return params;
}

function calculateDateRange(start_date, percent_change){
  const start_month = start_date.format('M');
  const start_year = start_date.format('YYYY');
  let range_start_month, range_start_date, range_end_date;

  if (percent_change == '1') {
    range_start_month = start_date.format('MM');
  }
  else if (percent_change == '3') {
    if (1 <= start_month && start_month <= 3)
      range_start_month = '01';
    if (4 <= start_month && start_month <= 6)
      range_start_month = '04';
    if (7 <= start_month && start_month <= 9)
      range_start_month = '07';
    if (10 <= start_month && start_month <= 12)
      range_start_month = '10';
  }
  else if (percent_change == '6') {
    if (1 <= start_month && start_month <= 6)
      range_start_month = '01';
    if (7 <= start_month && start_month <= 12)
      range_start_month = '07';
  }
  else {
    range_start_month = '01';
  }
  range_start_date = moment(start_year + '-' + range_start_month).format('YYYY-MM-DD');
  range_end_date = moment(range_start_date).add(parseInt(percent_change) + 11, 'M').format('YYYY-MM-DD');

  return range_start_date + ' TO ' + range_end_date;
}
