import { values, capitalize, compact, has, map, snakeCase } from '../utils/lodash';
import { buildPortsValues } from './build_ports_values.js';
import { calculatePercentageChange } from './shared_functions.js';
import { performSort } from './sort_reports.js';

export function buildReports(agg_results, params){
  var percent_change = params.percent_change;
  var visible_fields = params.visible_fields;
  var sort_param = params.sort;

  for (var key in agg_results) {
    var entry = Object.assign(agg_results[key], EMPTY_RECORD);

    visible_fields = visible_fields ? visible_fields : 'total'
    var arrivals_keys = map(visible_fields.split(','), type => { return type + "_arrivals"; });

    entry = populateAdditionalFields(arrivals_keys, entry, percent_change);
    entry = populatePercentOfTotalFields(visible_fields, entry);

    if(visible_fields.includes('ports')) // Add ports fields
      agg_results[key] = Object.assign(entry, buildPortsValues(entry.ports_arrivals, visible_fields, entry.total_arrivals_sum, percent_change));
  }
  agg_results = performSort(sort_param, values(agg_results));

  return agg_results;
}

function populateAdditionalFields(arrivals_keys, entry, percent_change){
  for (var i in arrivals_keys) {
    var arrivals_type = arrivals_keys[i];
    if (arrivals_type == "ports_arrivals") continue; // Ports fields need custom treatment
    var ordered = {};
    var sum = 0;
    // Sort amounts and add sum and percent change:
    if (has(entry, arrivals_type)){
      Object.keys(entry[arrivals_type]).sort().forEach(function(k) {
        ordered[k] = entry[arrivals_type][k];
        sum += ordered[k];
      });
      entry[arrivals_type] = ordered;
      entry[arrivals_type + "_sum"] = sum;
      entry[arrivals_type + "_percent_change"] = calculatePercentageChange(entry[arrivals_type], percent_change);
    }
  }
  return entry;
}

function populatePercentOfTotalFields(visible_fields, entry){
  if (visible_fields.includes('total') && visible_fields.includes('business_visa')) {
    entry.business_visa_arrivals_percent_of_total = ((entry.business_visa_arrivals_sum / entry.total_arrivals_sum) * 100).toFixed(2).toString() + "%";
  }
  if (visible_fields.includes('total') && visible_fields.includes('pleasure_visa')) {
    entry.pleasure_visa_arrivals_percent_of_total = ((entry.pleasure_visa_arrivals_sum / entry.total_arrivals_sum) * 100).toFixed(2).toString() + "%";
  }
  if (visible_fields.includes('total') && visible_fields.includes('student_visa')) {
    entry.student_visa_arrivals_percent_of_total = ((entry.student_visa_arrivals_sum / entry.total_arrivals_sum) * 100).toFixed(2).toString() + "%";
  }
  return entry;
}

const EMPTY_RECORD = {
  total_arrivals_sum: "",
  business_visa_arrivals_sum: "",
  business_visa_arrivals_percent_of_total: "",
  pleasure_visa_arrivals_sum: "",
  pleasure_visa_arrivals_percent_of_total: "",
  student_visa_arrivals_sum: "",
  student_visa_arrivals_percent_of_total: "",
}