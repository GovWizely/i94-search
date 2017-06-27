import 'babel-polyfill';
import { SET_FORM_OPTIONS } from 'constants';

export function form_options(state = {
  countries: [],
  worldRegions: [],
  nttoGroups: []
}, action) {
  switch (action.type) {
  case SET_FORM_OPTIONS:
    return Object.assign({}, state, {
      countries: action.countries,
      worldRegions: action.world_regions,
      nttoGroups: action.ntto_groups
    });
  default:
    return state;
  }
}