import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { camelCase, isEmpty, map, omit, omitBy, reduce, snakeCase } from '../utils/lodash';
import { stringify } from 'querystring';
import { Form, Result, Spinner, AggregatedResult } from '../components';
import { fetchResultsIfNeeded, fetchAggResultsIfNeeded, pageResults, setVisibleFields } from '../actions';
import './App.scss';

class App extends Component {
  componentDidMount() {
    const { dispatch, query } = this.props;
    this.props.dispatch(setVisibleFields(query['visible_fields'] ? query['visible_fields'] : "total"));
    //dispatch(fetchResultsIfNeeded(query));
    dispatch(fetchAggResultsIfNeeded(query));
  }

  handlePaging = (e) => {
    e.preventDefault();
    if (!e.target.dataset.page) return;

    const { dispatch, query } = this.props;
    const offset = (parseInt(e.target.dataset.page, 10) - 1) * 10;
    const params = Object.assign({}, omitBy(query, isEmpty), { offset });
    dispatch(fetchResultsIfNeeded(params));
    this.push(params);
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

    this.props.dispatch(setVisibleFields(params['visible_fields'] ? params['visible_fields'] : "total"));
    //this.props.dispatch(fetchResultsIfNeeded(params));
    this.props.dispatch(fetchAggResultsIfNeeded(params));
    this.push(params);
  }

  push(params) {
    this.props.history.push(`?${stringify(params)}`);
  }

  render() {

    const { query, results } = this.props;
    const formValues = reduce(
      query,
      (result, value, key) => Object.assign(result, { [camelCase(key)]: value }),
      {});

    return (
      <div className="explorer">
        <h1 className="Header-1"><b>National Travel and Tourism Office (NTTO) I-94 Arrivals Data</b></h1>
        <p className="DefaultParagraph-1">Search for I-94 arrivals data and generate reports for each country or region in the results. </p>

        <div className="explorer__content">

          <Form onSubmit={this.handleSubmit} initialValues={formValues} />
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
};

function mapStateToProps(state, ownProps) {
  const query = ownProps.history.getCurrentLocation().query;
  const { results } = state;
  return {
    query,
    results,
  };
}

export default connect(mapStateToProps)(App);
