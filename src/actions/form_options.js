import fetch from 'isomorphic-fetch';
import { stringify } from 'querystring';
import { isEmpty, omit, values, has, map } from '../utils/lodash';
import { SET_FORM_OPTIONS } from '../constants';
import config from '../config.js';
import { propComparator } from './sort_reports';
import { receiveFailure } from './results.js';

const { host, apiKey } = config.api.i94;

export function setFormOptions(options){
  let countries = map(options.aggregations.countries, obj => { 
    return optionObject(obj['key']);
  }).sort(propComparator('value', 'asc'));
  let world_regions = map(options.aggregations.world_regions, obj => { 
    return optionObject(obj['key']); 
  }).sort(propComparator('value', 'asc'));
  let ntto_groups = map(options.aggregations.ntto_groups, obj => { 
    return optionObject(obj['key']); 
  }).sort(propComparator('value', 'asc'));

  return {
    type: SET_FORM_OPTIONS,
    countries: countries,
    world_regions: world_regions,
    ntto_groups: ntto_groups
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

function optionObject(val){
  return {label: val, value: val}
}