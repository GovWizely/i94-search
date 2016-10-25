import { values, capitalize, compact, has, map, snakeCase } from '../utils/lodash';

export function performSort(sort_param, transformed_results){
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
    var amount_a = getSortablePortAmount(a, sort_param);
    var amount_b = getSortablePortAmount(a, sort_param);

    if (amount_a > amount_b)
      return -1;
    if (amount_a < amount_b)
      return 1;
    return 0;
  });
  return reports;
}

function getSortablePortAmount(report, sort_param){
  var sortable_amount = 0;
  if (report.ports_arrivals_sums.length == 0) return sortable_amount;

  for (var i in report.ports_arrivals_sums){
    var entry = report.ports_arrivals_sums[i];
    if (snakeCase(entry.port) == sort_param) {
      sortable_amount = entry.amount;
      break;
    }
  }
  return sortable_amount;
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