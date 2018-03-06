import fetch from 'isomorphic-fetch';
import { stringify } from 'querystring';
import { isEmpty, omit, values, has, map, compact, snakeCase } from '../utils/lodash';
import { SET_FORM_OPTIONS, SET_DATE_RANGE } from '../constants';
import config from '../config.js';
import { propComparator } from './sort_reports';
import { receiveFailure } from './results.js';

const { host, apiKey } = config.api.i94;

export function setFormOptions(options){
  let countries = buildFormOptions(options.aggregations.countries);
  let world_regions = buildFormOptions(options.aggregations.world_regions);
  let ntto_groups = buildFormOptions(options.aggregations.ntto_groups);

  let date_vals = findStartAndEndDate(options.aggregations.dates);

  return {
    type: SET_FORM_OPTIONS,
    countries: countries,
    world_regions: world_regions,
    ntto_groups: ntto_groups,
    date_range: date_vals
  };
}

export function setDateRange(options){
  let date_vals = findStartAndEndDate(options.aggregations.dates);

  return {
    type: SET_DATE_RANGE,
    date_range: date_vals
  };
}

export function requestFormOptions(){
  return (dispatch) => {
    return fetch(`${host}?api_key=${apiKey}&size=1`)
        .then(response => response.json())
        .then(json => dispatch(setFormOptions(json)))
        .catch((error) => {
          dispatch(receiveFailure('There was an error connecting to the data source: ' + error));
        });;
  };
}

export function requestDateOptions(value, field){
  const querystring = snakeCase(field) + "=" + value;

  return (dispatch) => {
    return fetch(`${host}?api_key=${apiKey}&size=1&${querystring}`)
        .then(response => response.json())
        .then(json => dispatch(setDateRange(json)))
        .catch((error) => {
          dispatch(receiveFailure('There was an error connecting to the data source: ' + error));
        });;
  };
}

function buildFormOptions(aggregations){
  return compact(map(aggregations, obj => { 
    if(obj.key != "")
      return {label: obj.key, value: obj.key}
  })).sort(propComparator('value', 'asc'));
}

function findStartAndEndDate(dates){
  const date_vals = map(dates, obj =>{
    return obj.key;
  }).sort();

  return [date_vals[0], date_vals[date_vals.length-1]];
}