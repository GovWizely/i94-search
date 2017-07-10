import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import expect from 'expect';
import config from '../../config';
import * as actions from '../../actions/results';
import mockSearchResponse from './results_fixture.js';

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

const mock_search_response = mockSearchResponse;
const { host, apiKey } = config.api.i94;

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('creates RECEIVE_AGG_RESULTS after building reports', () => {
    nock(host)
      .get(`?api_key=${apiKey}&size=100&offset=${offset}&${querystring}`)
      .reply(200, mock_search_response)

    const store = mockStore(initialize_store);
    console.log(store.getActions())
    console.log(store.getState())

    return store.dispatch(actions.fetchAggResultsIfNeeded(params)).then(() => {
      console.log(store.getActions())
    });
  });
});