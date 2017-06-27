import { isEmpty, map, omit, has } from '../../utils/lodash';
import React, { PropTypes } from 'react';
import Item from './Item';
import Pages from './Pages';
import './Result.scss';
import moment from 'moment';
import FileSaver from 'file-saver';

const ResultCountLabel = ({ count, query }) => {
  let text = '';
  if (!isEmpty(omit(query, ['offset', 'percent_change']))) {
    if (count === 1) text = ` report found.`;
    else text = ` reports found.`;
  }
  if (text == '') count = '';
  
  return <span className="result-count-label"><div className="result-count">{count}</div>{text}</span>;
};
ResultCountLabel.propTypes = {
  count: PropTypes.number.isRequired,
  query: PropTypes.object,
};

const TimeFrameLabel = ({ query }) => {
  let time_frame = '';
  if (has(query, 'date')) {
    time_frame = query['date'].split(" TO ");
    time_frame = moment(time_frame[0]).format('MMM YYYY') + " to " + moment(time_frame[1]).format('MMM YYYY');
  }
  else {
    time_frame = "no time frame specified";
  }
  let text = '';
  if (!isEmpty(omit(query, ['offset', 'percent_change']))) {
    text = `I-94 Arrivals for:  ${time_frame}.`;
  }
  return <p className="explorer__result__label">{text}</p>;
};
TimeFrameLabel.propTypes = {
  query: PropTypes.object,
};

function downloadReports(reports){
  const blob = new Blob([JSON.stringify(reports, null, 4)], {type: "text/plain;charset=utf-8"});
  FileSaver.saveAs(blob, "reports.json");
}

const DownloadButton = ({count, results}) => {
  if (count === 0) return null;
  else {
    return (
      <button className="download-button pure-button pure-button-primary" onClick={ () => {downloadReports(results)}}>
        <i className="fa fa-paper-plane" /> Download JSON Reports
      </button>
    );
  }
}
DownloadButton.propTypes = {
  count: PropTypes.number.isRequired,
  results: PropTypes.array,
};

const AggregatedResult = ({ onPaging, query = {}, results }) => {
  if (results.isFetchingAggs) return null;
  if (results.error != "") 
    return (<div className="explorer__result">{results.error}</div>);

  const items = map(results.pageItems, result => {
    const key = result.i94_country_or_region;
    return <Item key={key} result={result} />
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
