import { values, zipObject } from '../utils/lodash';
import moment from 'moment';

export function calculatePercentageChange(values_hash, percent_change) {
  const values_array = values(values_hash);
  const values_dates = Object.keys(values_hash);
  percent_change = parseInt(percent_change);
  const percent_change_label = percentChangeLabel(percent_change);

  if ( values_array.length < percent_change ) return ["Not enough data."]

  const start = values_array.slice(0, percent_change).reduce((a, b) => a + b, 0);
  const start_date_range = values_dates[0] + ' to ' + values_dates[percent_change - 1];

  if ( values_array.length < percent_change * 2) {
    return [percent_change_label,
        start_date_range + ":  " + start.toLocaleString(), 
        "Not enough data."];
  }
  
  const end = values_array.slice(values_array.length - percent_change, values_array.length).reduce((a, b) => a + b, 0);
  const end_date_range = values_dates[values_array.length - percent_change] + ' to ' + values_dates[values_array.length - 1];

  return [percent_change_label,
          start_date_range + ":  " + start.toLocaleString(), 
          end_date_range + ":  " + end.toLocaleString(), 
          ((end - start)/start * 100).toFixed(2).toString() + "%"];
}

export function filterValuesForInterval(values_hash, percent_change){
  const values_array = values(values_hash);
  const keys_array = Object.keys(values_hash);

  const expected_interval_two_start = moment(keys_array[0]).add(12, 'M').format('YYYY-MM');
  let expected_interval_two_start_index = keys_array.indexOf(expected_interval_two_start);
  expected_interval_two_start_index = (expected_interval_two_start_index == -1) ? keys_array.length : expected_interval_two_start_index;

  const filtered_values = values_array.slice(0, percent_change).concat(values_array.slice(expected_interval_two_start_index, values_array.length));
  const filtered_keys = keys_array.slice(0, percent_change).concat(keys_array.slice(expected_interval_two_start_index, keys_array.length));
  
  const return_hash = zipObject(filtered_keys, filtered_values);

  return return_hash;
}

function percentChangeLabel(percent_change) {
  switch (percent_change) {
    case 1:
        return "Monthly";
    case 3:
        return "Quarterly";
    case 6:
        return "Half Year";
    case 9:
        return "Three Quarters Year";
    case 12:
        return "Annual";
  } 
}