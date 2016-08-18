import React, { PropTypes } from 'react';
import { Row, UnorderedList } from './DetailItem';

const Detail = ({ result, visibleFields }) => {
  var total_row, business_row, pleasure_row, student_row;
  if (visibleFields.includes('total')) {
    total_row = <Row label="Total Amount">{result.total_amount.toLocaleString()}</Row>;
  } 
  if (visibleFields.includes('business_visa')) {
    business_row = <Row label="Business Visa Amount">{result.business_visa_amount.toLocaleString()}</Row>;
  }
  if (visibleFields.includes('pleasure_visa')){
    pleasure_row = <Row label="Pleasure Visa Amount">{result.pleasure_visa_amount.toLocaleString()}</Row>;
  }
  if (visibleFields.includes('student_visa')){
    student_row = <Row label="Student Visa Amount">{result.student_visa_amount.toLocaleString()}</Row>;
  }

  return (
    <table className="explorer__result-item__detail">
      <tbody>
        <Row label="I94 Country or Region">{result.i94_country_or_region}</Row>
        <Row label="NTTO Groups">
          <UnorderedList value={result.ntto_group} />
        </Row>
        <Row label="Date">{result.date}</Row>

        {total_row}
        {business_row}
        {pleasure_row}
        {student_row}

        <Row label="Country">{result.country}</Row>
        <Row label="World Regions">
          <UnorderedList value={result.world_region} />
        </Row>
        <Row label="I94 Code">{result.i94_code.toString()}</Row>
      </tbody>
    </table>
  )
};
Detail.propTypes = {
  result: PropTypes.object.isRequired,
  visibleFields: PropTypes.array.isRequired
};

export default Detail;
