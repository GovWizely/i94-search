import { isEmpty, map, omit, has } from '../../utils/lodash';
import React, { PropTypes } from 'react';
import Item from './Item';
import Pages from './Pages';
import './Result.scss';
import moment from 'moment';

const ResultCountLabel = ({ count, query }) => {
  let text = '';
  if (!isEmpty(omit(query, ['offset', 'sort', 'percent_change']))) {
    if (count === 0) text = 'No results.';
    else if (count === 1) text = `${count} report found.`;
    else if (count >= 10000) text = 'Too many results, enter more terms to narrow search.';
    else text = `${count} reports found.`;
  }
  return <p className="result-count-label">{text}</p>;
};
ResultCountLabel.propTypes = {
  count: PropTypes.number.isRequired,
  query: PropTypes.object,
};

const TimeFrameLabel = ({ query }) => {
  if (has(query, 'date')) {
    var time_frame = query['date'].split(" TO ");
    time_frame = moment(time_frame[0]).format('MMM YYYY') + " to " + moment(time_frame[1]).format('MMM YYYY');
  }
  else
    var time_frame = "no time frame specified";
  let text = 'Enter a search term in one of the form fields and click "Generate Reports".';
  if (!isEmpty(omit(query, ['offset', 'sort', 'percent_change']))) {
    text = `I-94 Arrivals for:  ${time_frame}.`;
  }
  return <p className="explorer__result__label">{text}</p>;
};
TimeFrameLabel.propTypes = {
  query: PropTypes.object,
};

const AggregatedResult = ({ onPaging, query = {}, results }) => {
  if (results.isFetchingAggs) return null;

  const items = map(results.pageItems, result => {
    const key = result.i94_country_or_region;
    return <Item key={key} result={result} visibleFields={results.visibleFields}/>
  });

  const pagesProps = {
    current: Math.ceil((results.offset ? results.offset : 0) / 10) + 1,
    displayed: 5,
    total: Math.ceil(results.aggregatedItems.length / 10),
    handleClick: onPaging,
  };

  return (
    <div className="explorer__result">
      <TimeFrameLabel query={query} />
      <ResultCountLabel count={results.aggregatedItems.length} query={query} />
      {items}
      <Pages {...pagesProps} />
    </div>
  );
};
AggregatedResult.propTypes = {
  onPaging: PropTypes.func.isRequired,
  query: PropTypes.object,
  results: PropTypes.object,
};

export default AggregatedResult;
