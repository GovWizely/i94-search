import React, { PropTypes } from 'react';
import { Row, UnorderedList } from './DetailItem';

const Detail = ({ result }) => (
  <table className="explorer__result-item__detail">
    <tbody>
      <Row label="I94 Country">{result.i94_country}</Row>
      <Row label="I94 Region">{result.i94_region}</Row>
      <Row label="Date">{result.date}</Row>
      <Row label="I94 Code">{result.i94_code.toString()}</Row>
      <Row label="Amount">{result.amount.toString()}</Row>
      <Row label="Country">{result.country}</Row>
      <Row label="World Regions">
        <UnorderedList value={result.world_region} />
      </Row>
    </tbody>
  </table>
);
Detail.propTypes = {
  result: PropTypes.object.isRequired,
};

export default Detail;
