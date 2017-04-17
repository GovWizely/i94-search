import { values, capitalize, compact, has, map, snakeCase } from '../utils/lodash';

export function performSort(sort_param, transformed_results){
  if (sort_param == "")
    return transformed_results;

  sort_param = sort_param.split(',')[0];

  var sort_array = sort_param.split(":");
  var sort_prop = sort_array[0];
  var sort_order = sort_array[1];

  transformed_results.sort(propComparator(sort_prop, sort_order));

  return transformed_results;
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