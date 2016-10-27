import { values, capitalize, compact, has, map } from '../utils/lodash';

export function buildAggResults(raw_results, agg_results, params) {
  var i;
  var visible_fields = params.visible_fields ? params.visible_fields : 'total'
  for (i in raw_results) {
    var entry = raw_results[i];
    var key = entry.i94_country_or_region;
    if ( !has(agg_results, key) ) {
      // Build initial agg entry if it doesn't exist yet:
      agg_results[key] = buildNewEntry(visible_fields, entry)
    }
    // Add date-amount k-v's to agg entry:
    if (visible_fields.includes('total'))
      agg_results[key].total_arrivals[entry.date] = entry.total_arrivals;
    if ( visible_fields.includes('business_visa') && entry.business_visa_arrivals != null )
      agg_results[key].business_visa_arrivals[entry.date] = entry.business_visa_arrivals;
    if ( visible_fields.includes('pleasure_visa') && entry.pleasure_visa_arrivals != null )
      agg_results[key].pleasure_visa_arrivals[entry.date] = entry.pleasure_visa_arrivals;
    if ( visible_fields.includes('student_visa') && entry.student_visa_arrivals != null )
      agg_results[key].student_visa_arrivals[entry.date] = entry.student_visa_arrivals;
    if ( visible_fields.includes('ports')  && entry.ports_arrivals.length > 0 )
      agg_results[key].ports_arrivals[entry.date] = entry.ports_arrivals;
  }

  return agg_results;
}

function buildNewEntry(visible_fields, entry){
  var return_hash = {
    i94_country_or_region: entry.i94_country_or_region,
    ntto_group: entry.ntto_group,
    i94_code: entry.i94_code,
    country: entry.country,
    world_region: entry.world_region
  }

  if (visible_fields.includes('total'))
    return_hash.total_arrivals = {};
  if ( visible_fields.includes('business_visa') && entry.business_visa_arrivals != null )
    return_hash.business_visa_arrivals = {};
  if ( visible_fields.includes('pleasure_visa') && entry.pleasure_visa_arrivals != null )
    return_hash.pleasure_visa_arrivals = {};
  if ( visible_fields.includes('student_visa') && entry.student_visa_arrivals != null )
    return_hash.student_visa_arrivals = {};
  if ( visible_fields.includes('ports')  && entry.ports_arrivals.length > 0 )
    return_hash.ports_arrivals = {};

  return return_hash;
}