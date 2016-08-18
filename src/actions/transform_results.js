import { values, capitalize, compact, has, map } from '../utils/lodash';

export function transformResults(results, params) {
  var transformed_results = {};
  var i;

  for (i in results) {
    var entry = results[i];
    var key = entry.i94_country_or_region;
    if ( !has(transformed_results, key) ) {
      // Build initial transformed entry if it doesn't exist yet:
      transformed_results[key] = buildNewEntry(entry)
    }
    // Add date-amount k-v's to transformed entry:
    transformed_results[key].total_amounts[entry.date] = entry.total_amount;
    if ( entry.business_visa_amount != null )
      transformed_results[key].business_visa_amounts[entry.date] = entry.business_visa_amount;
    if ( entry.pleasure_visa_amount != null )
      transformed_results[key].pleasure_visa_amounts[entry.date] = entry.pleasure_visa_amount;
    if ( entry.student_visa_amount != null )
      transformed_results[key].student_visa_amounts[entry.date] = entry.student_visa_amount;
  }

  transformed_results = buildAggregateValues(transformed_results, params.percent_change, params.visible_fields);
  transformed_results = performSort(params.sort, values(transformed_results));

  return transformed_results;
}

function buildAggregateValues(transformed_results, percent_change, visible_fields){
  var key = "";
  for (key in transformed_results) {
    var entry = transformed_results[key];
    var i = "";

    visible_fields = visible_fields ? visible_fields : 'total'
    var amount_keys = map(visible_fields.split(','), type => { return type + "_amounts"; });

    for (i in amount_keys) {
      var amount_type = amount_keys[i];
      var ordered = {};
      var sum = 0;

      // Sort amounts and add sum:
      Object.keys(entry[amount_type]).sort().forEach(function(k) {
        ordered[k] = entry[amount_type][k];
        sum += ordered[k];
      });

      entry[amount_type] = ordered;
      entry[amount_type + "_sum"] = sum;
      entry[amount_type + "_percent_change"] = calculatePercentageChange(values(entry[amount_type]), percent_change);
    }

    if (visible_fields.includes('total') && visible_fields.includes('business_visa'))
      entry["business_visa_percent_of_total"] = ((entry.business_visa_amounts_sum / entry.total_amounts_sum) * 100).toFixed(2).toString() + "%"
    if (visible_fields.includes('total') && visible_fields.includes('pleasure_visa'))
      entry["pleasure_visa_percent_of_total"] = ((entry.pleasure_visa_amounts_sum / entry.total_amounts_sum) * 100).toFixed(2).toString() + "%"
    if (visible_fields.includes('total') && visible_fields.includes('student_visa'))
      entry["student_visa_percent_of_total"] = ((entry.student_visa_amounts_sum / entry.total_amounts_sum) * 100).toFixed(2).toString() + "%"
  }

  return transformed_results;
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

  sort_param = sort_param.split(',')[0];

  var sort_array = sort_param.split(":");
  var sort_prop = sort_array[0];
  var sort_order = sort_array[1];

  if (sort_prop == "date") // Don't need to sort agg results by date
    return transformed_results;

  if (sort_prop.indexOf("amount") !== -1)
    sort_prop = sort_prop + "s_sum";

  console.log(sort_prop)

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

function buildNewEntry(entry){
  return {
    i94_country_or_region: entry.i94_country_or_region,
    ntto_group: entry.ntto_group,
    i94_code: entry.i94_code,
    country: entry.country,
    world_region: entry.world_region,
    total_amounts: {},
    business_visa_amounts: {},
    pleasure_visa_amounts: {},
    student_visa_amounts: {}
  }
}

