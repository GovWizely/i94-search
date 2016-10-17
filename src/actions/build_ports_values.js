import { values, has, compact, capitalize, map, snakeCase } from '../utils/lodash';

export function sortPortsArrivals(ports_arrivals){
  for (var date_key in ports_arrivals) {
    var ports_array = ports_arrivals[date_key];
    ports_array.sort(compare);
  }
  return ports_arrivals
}

export function buildPortsValues(ports_arrivals, visible_fields, total_arrivals_sum, percent_change){
  var ports_arrivals_sums = {};
  var return_hash = {};
  var ports_values_arrays = {};

  for (var date_key in ports_arrivals) {
    var ports_array = ports_arrivals[date_key];

    ports_array.forEach( function (entry) {
      if (has(ports_arrivals_sums, entry.port) && has(ports_values_arrays, entry.port)) {
        ports_arrivals_sums[entry.port].amount += entry.amount;
        ports_values_arrays[entry.port].amount.push(entry.amount);
      }
      else{
        ports_arrivals_sums[entry.port] = {};
        ports_arrivals_sums[entry.port].port = entry.port;
        ports_arrivals_sums[entry.port].amount = entry.amount;
        ports_values_arrays[entry.port] = {};
        ports_values_arrays[entry.port].amount = [entry.amount];
        ports_values_arrays[entry.port].port = entry.port;
      }
    });
  }

  values(ports_values_arrays).forEach( function (entry) {
    entry.amount = calculatePercentageChange(entry.amount, percent_change);
  });

  return_hash.ports_arrivals_sums = values(ports_arrivals_sums).sort(compare);
  if (total_arrivals_sum != "")  return_hash.ports_arrivals_percent_of_total = calculatePercentofTotal(ports_arrivals_sums, total_arrivals_sum);
  return_hash.ports_arrivals_percent_changes = values(ports_values_arrays);

  return return_hash;
}

function calculatePercentofTotal(ports_arrivals_sums, total_arrivals_sum){
  var ports_arrivals_percent_of_total = [];
  
  values(ports_arrivals_sums).forEach( function (entry) {
    ports_arrivals_percent_of_total.push({ port: entry.port, amount: ((entry.amount / total_arrivals_sum) * 100).toFixed(2).toString() + "%"})
  });

  return ports_arrivals_percent_of_total;
}

function calculatePercentageChange(values_array, percent_change){
  values_array = compact(values_array);
  if ( values_array.length == 0 ) {
    return "No values."
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

  return ((end - start)/start * 100).toFixed(2).toString() + "%";
}

function compare(a,b) {
  if (a.amount > b.amount)
    return -1;
  if (a.amount < b.amount)
    return 1;
  return 0;
}