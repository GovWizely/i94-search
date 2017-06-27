import { values, capitalize, compact, has, map } from '../utils/lodash';

export function buildAggResults(raw_results, agg_results) {
  for (let i in raw_results) {
    let entry = raw_results[i];
    let key = entry.i94_country_or_region;
    if ( !has(agg_results, key) ) {
      // Build initial agg entry if it doesn't exist yet:
      agg_results[key] = buildNewEntry(entry)
    }
    // Add date-amount k-v's to agg entry:
      agg_results[key].total_arrivals[entry.date] = entry.total_arrivals;
    if ( entry.business_visa_arrivals != null )
      agg_results[key].business_visa_arrivals[entry.date] = entry.business_visa_arrivals;
    if ( entry.pleasure_visa_arrivals != null )
      agg_results[key].pleasure_visa_arrivals[entry.date] = entry.pleasure_visa_arrivals;
    if ( entry.student_visa_arrivals != null )
      agg_results[key].student_visa_arrivals[entry.date] = entry.student_visa_arrivals;
    if ( entry.ports_arrivals.length > 0 )
      agg_results[key].ports_arrivals[entry.date] = entry.ports_arrivals;
  }
  
  return agg_results;
}

function buildNewEntry(entry){
  return {
    i94_country_or_region: entry.i94_country_or_region,
    ntto_group: entry.ntto_group,
    i94_code: entry.i94_code,
    country: entry.country,
    world_region: entry.world_region,
    total_arrivals: {},
    business_visa_arrivals: {},
    pleasure_visa_arrivals: {},
    student_visa_arrivals: {},
    ports_arrivals: {}
  }
}