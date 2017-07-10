/*
  The I-94 API must be available locally via webservices and endpointme in order for this test to run!
*/
import config from '../../config';
import fetch from 'isomorphic-fetch';

describe('fetching results from api', () => {
  const { host, apiKey } = config.api.i94;
  const expected_result_fields = 
    ['id', 'i94_country_or_region', 'date', 'country', 'world_region', 'ntto_group', 'total_arrivals', 'business_visa_arrivals', 'pleasure_visa_arrivals', 'student_visa_arrivals', 'ports_arrivals'];
  const expected_aggregations = ['countries', 'world_regions', 'ntto_groups'];

  it('expects the correct schema from the api', () => {
    return fetch(`${host}?api_key=${apiKey}&size=1`)
    .then(response => response.json())
    .then((json) => {
      const result_fields = Object.keys(json.results[0]);
      expect(result_fields).toEqual(expected_result_fields);

      const aggregations = Object.keys(json.aggregations);
      expect(aggregations).toEqual(expected_aggregations);
    })
  })
})