import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { camelCase, compact, isEmpty, map, omit, omitBy, reduce, snakeCase, values } from '../utils/lodash';
import { stringify } from 'querystring';
import { Form, Spinner, AggregatedResult } from '../components';
import { fetchAggResultsIfNeeded, pageResults, requestFormOptions } from '../actions';
import './App.scss';

class App extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(requestFormOptions());
  }

  componentDidMount() {
    const { dispatch, query } = this.props;
    if(!isEmpty(compact(values(query))))
      dispatch(fetchAggResultsIfNeeded(query));
  }

  handleAggPaging = (e) => {
    e.preventDefault();
    if (!e.target.dataset.page) return;

    const { dispatch } = this.props;
    const offset = (parseInt(e.target.dataset.page, 10) - 1) * 10;
    dispatch(pageResults(offset));
  }

  handleSubmit = (form) => {
    const params = reduce(omitBy(form, isEmpty), (result, value, _key) => {
      const key = snakeCase(_key);
      return Object.assign(
        result, { [key]: Array.isArray(value) ? map(value, 'value').join(',') : value });
    }, {});
    this.props.dispatch(fetchAggResultsIfNeeded(params));
    this.push(params);
  }

  push(params) {
    this.props.history.push(`?${stringify(params)}`);
  }

  render() {
    const { query, results, form_options } = this.props;
    const formValues = reduce(
      query,
      (result, value, key) => Object.assign(result, { [camelCase(key)]: value }),
      {});

    return (
      <div className="explorer">
        <h1 className="Header-1"><b>National Travel and Tourism Office (NTTO) I-94 Arrivals Data</b></h1>
        <p className="DefaultParagraph-1">Search for I-94 arrivals data and generate reports for each country or region in the results. </p>

        <div className="explorer__content">

          <Form onSubmit={this.handleSubmit} initialValues={formValues} formOptions={form_options} dispatch={this.props.dispatch} />
          <Spinner active={results.isFetchingAggs} />
          <AggregatedResult results={results} onPaging={this.handleAggPaging} query={query} />
        </div>
      </div>
    );
  }
}
App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  results: PropTypes.object,
  form_options: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
  let query = ownProps.history.getCurrentLocation().query;
  const { results, form_options } = state;
  if (isEmpty(ownProps.history.getCurrentLocation().query)){
    query = {countries: null, start_date: null, percent_change: null };
  }
  return {
    query,
    results,
    form_options
  };
}

export default connect(mapStateToProps)(App);
