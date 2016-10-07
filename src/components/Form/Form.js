import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import countryList from '../../fixtures/countries';
import worldRegionsList from '../../fixtures/world_regions';
import sortList from '../../fixtures/sort';
import nttoGroupsList from '../../fixtures/ntto_groups';
import percentChangeList from '../../fixtures/percent_change';
import visibleFieldsList from '../../fixtures/visible_fields';
import './Form.scss';

const TextField = ({ description, field, label }) => (
  <div className="explorer__form__group">
    <label htmlFor={field.name}>{label}</label>
    {description ? <p>{description}</p> : null}
    <input type="text" className="explorer__form__input" id={field.name} {...field} />
  </div>
);
TextField.propTypes = {
  description: PropTypes.string,
  field: PropTypes.object.isRequired,
  label: PropTypes.string,
};

const SelectField = ({ description, field, label = 'Untitled', options, multi = false }) => (
  <div className="explorer__form__group">
    <label htmlFor={field.name}>{label}</label>
    {description ? <p>{description}</p> : null}
    <div>
      <Select
        {...field}
        options={options}
        multi={multi} autoBlur
        onBlur={() => field.onBlur(field.value)}
      />
    </div>
  </div>
);
SelectField.propTypes = {
  description: PropTypes.string,
  field: PropTypes.object.isRequired,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  multi: PropTypes.bool,
};

const DateField = ({ field }) => {
  return (
    <input type="month" className="explorer__form__input" id={field.name} {...field} />
  );
};
DateField.propTypes = {
  field: PropTypes.object.isRequired,
}

const DateRangeField = ({ description, label = 'Untitled', startDate, endDate }) => (
  <div className="explorer__form__group">
    <label>{label}</label>
    {description ? <p>{description}</p> : null}
    <DateField field={startDate} />
    <DateField field={endDate} />
  </div>
);
DateRangeField.propTypes = {
  description: PropTypes.string,
  endDate: PropTypes.object.isRequired,
  label: PropTypes.string,
  startDate: PropTypes.object.isRequired,
};


const Form = ({
  fields: { q, countries, worldRegions, startDate, endDate, sort, nttoGroups, percentChange, visibleFields },
  handleSubmit,
}) => (
  <form className="explorer__form" onSubmit={handleSubmit}>
    <fieldset>
      <TextField
        field={q} label="Keyword"
        description="Search against the i94_country_or_region field."
      />
      <SelectField
        field={countries} label="All Countries (Overseas, Canada, Mexico)" options={countryList} multi
        description="Choose which countries that you want to search."
      />
      <SelectField
        field={worldRegions} label="ITA World Regions" options={worldRegionsList} multi
        description="Choose which world regions you want to search."
      />

      <DateRangeField
        startDate={startDate}
        endDate={endDate}
        label="Date"
        description="Choose a range of months to filter arrivals data."
      />

      <SelectField
        field={sort} label="Sort Reports" options={sortList}
        description="Choose a parameter by which to sort reports.  The sort parameters will be applied in the order they are entered here."
      />

      <SelectField
        field={nttoGroups} label="NTTO Groups" options={nttoGroupsList} multi
        description="Choose which NTTO groups you want to search."
      />

      <SelectField
        field={percentChange} label="Percent Change" options={percentChangeList} multi
        description="Choose how to calculate percent changes in the reports.  Based on the given time range, this compares the first month vs. last month (Monthly), first 3 months vs. last 3 months (Quarterly), or first 12 months vs. last 12 months (Annual)."
      />

      <SelectField
        field={visibleFields} label="Visible Fields" options={visibleFieldsList} multi
        description="Choose which arrivals values you want to appear in the reports.  Only shows Total Arrivals by default."
      />

      <div className="explorer__form__group">
        <button className="explorer__form__submit pure-button pure-button-primary" onClick={handleSubmit}>
          <i className="fa fa-paper-plane" /> Generate Reports
        </button>
      </div>
    </fieldset>
  </form>
);
Form.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
export default reduxForm({
  form: 'form',
  fields: ['q', 'countries', 'worldRegions', 'startDate', 'endDate', 'sort', 'nttoGroups', 'percentChange', 'visibleFields'],
})(Form);
