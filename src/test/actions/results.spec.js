import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import expect from 'expect';
import config from '../../config';
import * as actions from '../../actions/results';
import mock_search_response from './api_results_fixture.js';
import expected_reports from './expected_reports.js';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const initialize_store = {
  isFetchingAggs: false,
  aggregatedItems: [],
  pageItems: [],
  offset: 0,
  invalidated: false,
  error: ""
};

const { host, apiKey } = config.api.i94;

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('creates RECEIVE_AGG_RESULTS after building reports', () => {
    nock(host)
      .get(`?api_key=${apiKey}&size=100&offset=0&countries=foo`)
      .reply(200, mock_search_response)

    const store = mockStore(initialize_store);
    const params = { countries: 'foo', percent_change: 1 };
    const expected_actions =  [ 
      { type: 'explorer/REQUEST_AGG_RESULTS' },
      { type: 'explorer/RECEIVE_AGG_RESULTS',
        payload: { results: expected_reports.results, total: 3 } } 
    ];

    return store.dispatch(actions.fetchAggResultsIfNeeded(params)).then(() => {
      expect(JSON.stringify(store.getActions())).toEqual(JSON.stringify(expected_actions));
    });
  });
});