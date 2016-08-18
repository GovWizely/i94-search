import React, { PropTypes } from 'react';
import { Row, UnorderedList, MonthlyAmountsList } from './DetailItem';

const Detail = ({ result, visibleFields }) => {

  var total_sum, total_percent_change, total_arrivals;
  var business_sum, business_percent_change, business_arrivals, business_percent_of_total;
  var pleasure_sum, pleasure_percent_change, pleasure_arrivals, pleasure_percent_of_total;
  var student_sum, student_percent_change, student_arrivals, student_percent_of_total;

  if (visibleFields.includes('total')) {
    total_sum  = <Row label="Total Arrivals">{result.total_amounts_sum.toLocaleString()}</Row>;
    total_percent_change = 
      <Row label="Percent Change for Total Arrivals">
        <UnorderedList value={result.total_amounts_percent_change} />
      </Row>;
    total_arrivals = 
      <Row label="Total Amounts">
        <MonthlyAmountsList value={result.total_amounts} />
      </Row>;
  } 
  if (visibleFields.includes('business_visa')) {
    business_sum = <Row label="Business Visa Arrivals">{result.business_visa_amounts_sum.toLocaleString()}</Row>;
    business_percent_change =
      <Row label="Percent Change for Business Arrivals">
        <UnorderedList value={result.business_visa_amounts_percent_change} />
      </Row>;
    business_arrivals = 
      <Row label="Business Visa Amounts">
        <MonthlyAmountsList value={result.business_visa_amounts} />
      </Row>;
  }
  if (visibleFields.includes('pleasure_visa')){
    pleasure_sum = <Row label="Pleasure Visa Arrivals">{result.pleasure_visa_amounts_sum.toLocaleString()}</Row>;
    pleasure_percent_change = 
      <Row label="Percent Change for Pleasure Arrivals">
        <UnorderedList value={result.pleasure_visa_amounts_percent_change} />
      </Row>;
    pleasure_arrivals = 
      <Row label="Pleasure Visa Amounts">
        <MonthlyAmountsList value={result.pleasure_visa_amounts} />
      </Row>;
  }
  if (visibleFields.includes('student_visa')){
    student_sum = <Row label="Student Visa Arrivals">{result.student_visa_amounts_sum.toLocaleString()}</Row>;
    student_percent_change =
      <Row label="Percent Change for Student Arrivals">
        <UnorderedList value={result.student_visa_amounts_percent_change} />
      </Row>;
    student_arrivals = 
      <Row label="Student Visa Amounts">
        <MonthlyAmountsList value={result.student_visa_amounts} />
      </Row>;
  }
  if (visibleFields.includes('total') && visibleFields.includes('business_visa')) {
    business_percent_of_total = <Row label="Business Visa Arrivals Percentage of Total">{result.business_visa_percent_of_total.toLocaleString()}</Row>;
  }
  if (visibleFields.includes('total') && visibleFields.includes('pleasure_visa')) {
    pleasure_percent_of_total = <Row label="Pleasure Visa Arrivals Percentage of Total">{result.pleasure_visa_percent_of_total.toLocaleString()}</Row>;
  }
  if (visibleFields.includes('total') && visibleFields.includes('student_visa')) {
    student_percent_of_total = <Row label="Student Visa Arrivals Percentage of Total">{result.student_visa_percent_of_total.toLocaleString()}</Row>;
  }


  return (
    <table className="explorer__result-item__detail">
      <tbody>
        <Row label="I94 Country or Region">{result.i94_country_or_region}</Row>
        <Row label="NTTO Groups">
          <UnorderedList value={result.ntto_group} />
        </Row>
        <Row label="Country">{result.country}</Row>
        <Row label="World Regions">
          <UnorderedList value={result.world_region} />
        </Row>
        <Row label="I94 Code">{result.i94_code.toString()}</Row>

        {total_sum}
        {total_percent_change}
        {total_arrivals}

        {business_sum}
        {business_percent_of_total}
        {business_percent_change}
        {business_arrivals}

        {pleasure_sum}
        {pleasure_percent_of_total}
        {pleasure_percent_change}
        {pleasure_arrivals}

        {student_sum}
        {student_percent_of_total}
        {student_percent_change}
        {student_arrivals}

      </tbody>
    </table>
  )
};
Detail.propTypes = {
  result: PropTypes.object.isRequired,
  visibleFields: PropTypes.array.isRequired
};

export default Detail;
