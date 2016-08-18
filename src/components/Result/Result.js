import { isEmpty, map, omit } from '../../utils/lodash';
import React, { PropTypes } from 'react';
import Item from './Item';
import Pages from './Pages';
import './Result.scss';

const Label = ({ count, query }) => {
  let text = 'I94 Arrivals Data by Month';
  if (!isEmpty(omit(query, 'offset'))) {
    if (count === 0) text = 'No result.';
    else if (count === 1) text = `${count} monthly result found.`;
    else text = `${count} monthly results found.`;
  }
  return <p className="explorer__result__label">{text}</p>;
};
Label.propTypes = {
  count: PropTypes.number.isRequired,
  query: PropTypes.object,
};

const Result = ({ onPaging, query = {}, results }) => {
  if (results.isFetching) return null;
  const items = map(results.items, result => (
    <Item key={result.id} result={result} visibleFields={results.visibleFields} />
  ));

  const pagesProps = {
    current: Math.ceil((query.offset ? query.offset : 0) / 10) + 1,
    displayed: 5,
    total: Math.ceil(results.total / 10),
    handleClick: onPaging,
  };

  return (
    <div className="explorer__result">
      <Label count={results.total} query={query} />
      {items}
      <Pages {...pagesProps} />
    </div>
  );
};
Result.propTypes = {
  onPaging: PropTypes.func.isRequired,
  query: PropTypes.object,
  results: PropTypes.object,
};

export default Result;
