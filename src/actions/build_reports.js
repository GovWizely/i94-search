import { values, capitalize, compact, has, map, snakeCase } from '../utils/lodash';
import { buildPortsValues } from './build_ports_values.js';
import { calculatePercentageChange, filterValuesForInterval } from './shared_functions.js';
import { performSort } from './sort_reports.js';

export function buildReports(agg_results, params){
  const percent_change = params.percent_change;

  for (let key in agg_results) {
    const entry = agg_results[key];
    const visible_fields = "total,business_visa,student_visa,pleasure_visa,ports";
    const arrivals_keys = map(visible_fields.split(','), type => { return type + "_arrivals"; });

    populateAdditionalFields(arrivals_keys, entry, percent_change);
    
    if( has(entry, 'ports_arrivals')) // Add ports fields
      agg_results[key] = Object.assign(entry, buildPortsValues(entry.ports_arrivals, percent_change));
  }
  agg_results = performSort('i94_country_or_region:asc', values(agg_results));

  return agg_results;
}

function populateAdditionalFields(arrivals_keys, entry, percent_change){
  for (let i in arrivals_keys) {
    const arrivals_type = arrivals_keys[i];
    if (arrivals_type == "ports_arrivals") continue; // Ports fields need custom treatment
    const ordered = {};

    // Sort amounts and add percent change:
    if (has(entry, arrivals_type)){
      Object.keys(entry[arrivals_type]).sort().forEach(function(k) {
        ordered[k] = entry[arrivals_type][k];
      });
      entry[arrivals_type] = filterValuesForInterval(ordered, percent_change);
      entry[arrivals_type + "_percent_change"] = calculatePercentageChange(entry[arrivals_type], percent_change);
    }
  }
}