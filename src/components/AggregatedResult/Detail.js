import React, { PropTypes } from 'react';
import { Row, UnorderedList, MonthlyAmountsList, PortsList, PortsAmounts, PortsPercentChange } from './DetailItem';
import { TotalsChartPair, VisaTypesChartPair, PortsChartPair } from './Graphs';
import Collapse from 'rc-collapse';
import 'rc-collapse/assets/index.css';

const Detail = ({ result }) => {
  return (
    <Collapse accordion={false}>
       <Collapse.Panel header="Total Arrivals Graphs">
        <TotalsChartPair data={result} />
      </Collapse.Panel>

      <Collapse.Panel header="Visa Type Graphs">
        <VisaTypesChartPair data={result} />
      </Collapse.Panel>

      <Collapse.Panel header="Top 10 Ports Graphs">
        <PortsChartPair data={result} />
      </Collapse.Panel>

      <Collapse.Panel header="Total Arrivals">
        <table className="explorer__result-item__detail">
          <tbody>
            <Row label="Percent Change for Total Arrivals">
              <UnorderedList value={result.total_arrivals_percent_change} />
            </Row>
            <Row label="Total Arrivals by Month">
              <MonthlyAmountsList value={result.total_arrivals} />
            </Row>
          </tbody>
        </table>
      </Collapse.Panel>

      <Collapse.Panel header="Visa Type Arrivals">
        <table className="explorer__result-item__detail">
          <tbody>
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
          </tbody>
        </table>
      </Collapse.Panel>

      <Collapse.Panel header="Ports of Entry Arrivals">
        <table className="explorer__result-item__detail">
          <tbody>
            <Row label="Percent Change for Ports of Entry Arrivals">
              <PortsPercentChange value={result.ports_arrivals_percent_changes} />
            </Row>

            <Row label="Ports of Entry Arrivals by Month">
              <PortsList value={result.ports_arrivals} />
            </Row>
          </tbody>
        </table>
      </Collapse.Panel>

      <Collapse.Panel header="Metadata">
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
          </tbody>
        </table>
      </Collapse.Panel>
    </Collapse>
  )
};
Detail.propTypes = {
  result: PropTypes.object.isRequired
};

export default Detail;
