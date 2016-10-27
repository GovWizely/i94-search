import { values, capitalize, compact, has, map, snakeCase } from '../utils/lodash';

export function calculatePercentageChange(values_hash, percent_change){
  var values_array = compact(values(values_hash));
  var values_dates = Object.keys(values_hash);

  if ( values_array.length == 0 ) return ["No values."]

  if (percent_change == 'quarterly'){
    var start = values_array.slice(0, 3).reduce((a, b) => a + b, 0);
    var end = values_array.slice(values_array.length-3, values_array.length).reduce((a, b) => a + b, 0);
    var start_date_range = values_dates[0] + ' to ' + values_dates[2];
    var end_date_range = values_dates[values_array.length-3] + ' to ' + values_dates[values_array.length-1];
  }
  else if (percent_change == 'annual'){
    var start = values_array.slice(0, 12).reduce((a, b) => a + b, 0);
    var end = values_array.slice(values_array.length-12, values_array.length).reduce((a, b) => a + b, 0);
    var start_date_range = values_dates[0] + ' to ' + values_dates[11];
    var end_date_range = values_dates[values_array.length-12] + ' to ' + values_dates[values_array.length-1];
  }
  else {
    percent_change = 'monthly'
    var start = values_array[0];
    var end = values_array[values_array.length - 1];
    var start_date_range = values_dates[0];
    var end_date_range = values_dates[values_array.length-1];
  }

  return [capitalize(percent_change),
          start_date_range + ":  " + start.toLocaleString(), 
          end_date_range + ":  " + end.toLocaleString(), 
          ((end - start)/start * 100).toFixed(2).toString() + "%"];
}