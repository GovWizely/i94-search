import React, { PropTypes } from 'react';
import { Row, UnorderedList, MonthlyAmountsList, PortsList, PortsAmounts, PortsPercentChange } from './DetailItem';
import { TotalsChartPair, VisaTypesChartPair, PortsChartPair } from './Graphs'

const Detail = ({ result }) => {
  return (
    <div>

    <TotalsChartPair data={result} />
    <VisaTypesChartPair data={result} />
    <PortsChartPair data={result} />

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

        <Row label="Percent Change for Total Arrivals">
          <UnorderedList value={result.total_arrivals_percent_change} />
        </Row>
        <Row label="Total Arrivals by Month">
          <MonthlyAmountsList value={result.total_arrivals} />
        </Row>

        <Row label="Percent Change for Business Visa Arrivals">
          <UnorderedList value={result.business_visa_arrivals_percent_change} />
        </Row>
        <Row label="Business Visa Arrivals by Month">
          <MonthlyAmountsList value={result.business_visa_arrivals} />
        </Row>

        <Row label="Percent Change for Pleasure Visa Arrivals">
          <UnorderedList value={result.pleasure_visa_arrivals_percent_change} />
        </Row>
        <Row label="Pleasure Visa Arrivals by Month">
          <MonthlyAmountsList value={result.pleasure_visa_arrivals} />
        </Row>

        <Row label="Percent Change for Student Visa Arrivals">
          <UnorderedList value={result.student_visa_arrivals_percent_change} />
        </Row>
        <Row label="Student Visa Arrivals by Month">
          <MonthlyAmountsList value={result.student_visa_arrivals} />
        </Row>

        <Row label="Percent Change for Ports of Entry Arrivals">
          <PortsPercentChange value={result.ports_arrivals_percent_changes} />
        </Row>

        <Row label="Ports of Entry Arrivals by Month">
          <PortsList value={result.ports_arrivals} />
        </Row>
      </tbody>
    </table>
    </div>
  )
};
Detail.propTypes = {
  result: PropTypes.object.isRequired
};

export default Detail;
