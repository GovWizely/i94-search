import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import expect from 'expect';
import config from '../../config';
import * as actions from '../../actions/form_options';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const initialize_store = {
  countries: [],
  worldRegions: [],
  nttoGroups: [],
};

const mock_response = {
  aggregations: {
    countries: [{key: "Canada"}, {key: "Mexico"}],
    world_regions: [{key: "North America"}],
    ntto_groups: [{key: "Visa Waiver"}, {key: "North America"}]
  }
};

const { host, apiKey } = config.api.i94;

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('sets form options after querying API', () => {

    nock(host)
      .get(`?api_key=${apiKey}&size=1`)
      .reply(200, mock_response)

    const store = mockStore(initialize_store);
    const expected_actions = [{
      type: 'explorer/SET_FORM_OPTIONS',
      countries: [{label: 'Canada', value: 'Canada'}, {label: 'Mexico', value: 'Mexico'}],
      world_regions: [{label: 'North America', value: 'North America'}],
      ntto_groups: [{label: 'North America', value: 'North America'}, {label: 'Visa Waiver', value: 'Visa Waiver'}]
    }]

    return store.dispatch(actions.requestFormOptions()).then(() => {
      console.log(JSON.stringify(store.getActions(), null, 2))
      expect(store.getActions()).toEqual(expected_actions);
    });
  });
});