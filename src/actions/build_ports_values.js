import { values, has, compact, capitalize, map, snakeCase } from '../utils/lodash';
import { calculatePercentageChange, filterValuesForInterval } from './shared_functions.js';

export function buildPortsValues(ports_arrivals, percent_change){
  ports_arrivals = sortPortsArrivals(ports_arrivals);
  ports_arrivals = filterValuesForInterval(ports_arrivals, percent_change);

  var return_hash = populateAdditionalFields(ports_arrivals, percent_change);
  return_hash.ports_arrivals = ports_arrivals;

  return return_hash;
}

function sortPortsArrivals(ports_arrivals){
  for (var date_key in ports_arrivals) {
    var ports_array = ports_arrivals[date_key];
    ports_array.sort(compare);
  }

  var ordered = {};
  Object.keys(ports_arrivals).sort().forEach(function(k) {
        ordered[k] = ports_arrivals[k];
      });
  return ordered;
}

function populateAdditionalFields(ports_arrivals, percent_change){
  var ports_arrivals_sums = {};
  var ports_values_by_date = {};
  var return_hash = {};

  for (var date_key in ports_arrivals) {
    var ports_array = ports_arrivals[date_key];

    ports_array.forEach( function (entry) {
      if (has(ports_arrivals_sums, entry.port) && has(ports_values_by_date, entry.port)) {
        ports_arrivals_sums[entry.port].amount += entry.amount;
        ports_values_by_date[entry.port].amount[date_key] = entry.amount;
      }
      else{
        ports_arrivals_sums[entry.port] = { port: entry.port, amount: entry.amount };
        ports_values_by_date[entry.port] = { port: entry.port, amount: {} };
        ports_values_by_date[entry.port].amount[date_key] = entry.amount;
      }
    });
  }
  ports_values_by_date = populatePercentageChange(ports_values_by_date, percent_change);

  return_hash.ports_arrivals_percent_changes = values(ports_values_by_date);
  return return_hash;
}

function populatePercentageChange(ports_values_by_date, percent_change){
  for(var k in ports_values_by_date) {
    var entry = ports_values_by_date[k];
    entry.amount = calculatePercentageChange(entry.amount, percent_change);
  }

  return ports_values_by_date;
}

function compare(a,b) {
  if (a.amount > b.amount)
    return -1;
  if (a.amount < b.amount)
    return 1;
  return 0;
}