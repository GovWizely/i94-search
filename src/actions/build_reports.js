import { values, capitalize, compact, has, map, snakeCase } from '../utils/lodash';
import { buildPortsValues, sortPortsArrivals } from './build_ports_values.js';

export function buildReports(agg_results, params){
  var percent_change = params.percent_change;
  var visible_fields = params.visible_fields;
  var sort_param = params.sort;

  for (var key in agg_results) {
    var entry = Object.assign(agg_results[key], EMPTY_RECORD);

    visible_fields = visible_fields ? visible_fields : 'total'
    var arrivals_keys = map(visible_fields.split(','), type => { return type + "_arrivals"; });

    for (var i in arrivals_keys) {
      var arrivals_type = arrivals_keys[i];
      if (arrivals_type == "ports_arrivals") // Ports vals need custom treatment
        continue;
      var ordered = {};
      var sum = 0;

      // Sort amounts and add sum:
      if (has(entry, arrivals_type)){
        Object.keys(entry[arrivals_type]).sort().forEach(function(k) {
          ordered[k] = entry[arrivals_type][k];
          sum += ordered[k];
        });
        entry[arrivals_type] = ordered;
        entry[arrivals_type + "_sum"] = sum;
        entry[arrivals_type + "_percent_change"] = calculatePercentageChange(values(entry[arrivals_type]), percent_change);
      }
    }

    if (visible_fields.includes('total') && visible_fields.includes('business_visa') && has(entry, 'business_visa_arrivals_sum')) {
      entry.business_visa_arrivals_percent_of_total = ((entry.business_visa_arrivals_sum / entry.total_arrivals_sum) * 100).toFixed(2).toString() + "%";
    }
    if (visible_fields.includes('total') && visible_fields.includes('pleasure_visa')) {
      entry.pleasure_visa_arrivals_percent_of_total = ((entry.pleasure_visa_arrivals_sum / entry.total_arrivals_sum) * 100).toFixed(2).toString() + "%";
    }
    if (visible_fields.includes('total') && visible_fields.includes('student_visa')) {
      entry.student_visa_arrivals_percent_of_total = ((entry.student_visa_arrivals_sum / entry.total_arrivals_sum) * 100).toFixed(2).toString() + "%";
    }
    if(visible_fields.includes('ports')) {
      entry.ports_arrivals = sortPortsArrivals(entry.ports_arrivals);
      agg_results[key] = Object.assign(entry, buildPortsValues(entry.ports_arrivals, visible_fields, entry.total_arrivals_sum, percent_change));
    }
  }
  agg_results = performSort(sort_param, values(agg_results));

  return agg_results;
}

function calculatePercentageChange(values_array, percent_change){
  values_array = compact(values_array);
  if ( values_array.length == 0 ) {
    return [capitalize(percent_change),
            "", 
            "", 
            "No values."]
  }

  if (percent_change == 'quarterly'){
    var start = values_array.slice(0, 3).reduce((a, b) => a + b, 0);
    var end = values_array.slice(values_array.length-3, values_array.length).reduce((a, b) => a + b, 0);
  }
  else if (percent_change == 'annual'){
    var start = values_array.slice(0, 12).reduce((a, b) => a + b, 0);
    var end = values_array.slice(values_array.length-12, values_array.length).reduce((a, b) => a + b, 0);
  }
  else {
    percent_change = 'monthly'
    var start = values_array[0];
    var end = values_array[values_array.length - 1];
  }

  return [capitalize(percent_change),
          start.toLocaleString(), 
          end.toLocaleString(), 
          ((end - start)/start * 100).toFixed(2).toString() + "%"];
}


function performSort(sort_param, transformed_results){
  if (sort_param == "")
    return transformed_results;
  if (sort_param.includes('port'))
    return sortByPorts(sort_param, transformed_results);

  sort_param = sort_param.split(',')[0];

  var sort_array = sort_param.split(":");
  var sort_prop = sort_array[0];
  var sort_order = sort_array[1];

  transformed_results.sort(propComparator(sort_prop, sort_order));

  return transformed_results;
}

function sortByPorts(sort_param, reports){
  sort_param = sort_param.split('.')[1]
  reports.sort(function(a, b){
    var val_a;
    var val_b;

    if (a.ports_arrivals_sums.length == 0) val_a = 0;
    if (b.ports_arrivals_sums.length == 0) val_b = 0;

    for (var i in a.ports_arrivals_sums){
      var entry = a.ports_arrivals_sums[i];
      if (snakeCase(entry.port) == sort_param) {
        val_a = entry.amount;
        break;
      }
    }

    for (var i in b.ports_arrivals_sums){
      var entry = b.ports_arrivals_sums[i];
      if (snakeCase(entry.port) == sort_param) {
        val_b = entry.amount;
        break;
      }
    }

    if (val_a > val_b)
      return -1;
    if (val_a < val_b)
      return 1;
    return 0;
  });

  return reports;
}

function propComparator(prop, order) {
  if (order === 'asc') {
    return function(a, b) {
      if (a[prop] < b[prop])
        return -1;
      if (a[prop] > b[prop])
        return 1;
      return 0;
    }
  }

  else if (order === 'desc') {
    return function(a, b) {
      if (a[prop] > b[prop])
        return -1;
      if (a[prop] < b[prop])
        return 1;
      return 0;
    }
  }
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