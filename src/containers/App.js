import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { camelCase, isEmpty, map, omitBy, reduce, snakeCase } from '../utils/lodash';
import { stringify } from 'querystring';
import { Form, Result, Spinner } from '../components';
import { fetchResultsIfNeeded } from '../actions';
import './App.scss';

class App extends Component {
  componentDidMount() {
    const { dispatch, query } = this.props;
    dispatch(fetchResultsIfNeeded(query));
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
  handleSubmit = (form) => {
    const params = reduce(omitBy(form, isEmpty), (result, value, _key) => {
      const key = snakeCase(_key);
      return Object.assign(
        result, { [key]: Array.isArray(value) ? map(value, 'value').join(',') : value });
    }, {});
    this.props.dispatch(fetchResultsIfNeeded(params));
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
        <h1 className="Header-1"><b>Search I94 International Arrivals Data</b></h1>
        <p className="DefaultParagraph-1">Search for I94 arrivals data.  Each entry shows the number of arrivals for a country or region for a given month. </p>

        <div className="explorer__content">
          <Form onSubmit={this.handleSubmit} initialValues={formValues} />
          <Spinner active={results.isFetching} />
          <Result results={results} onPaging={this.handlePaging} query={query} />
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
