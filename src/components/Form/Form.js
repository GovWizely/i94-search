import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import MonthPicker from './MonthPicker.js';

import countryList from '../../fixtures/countries';
import worldRegionsList from '../../fixtures/world_regions';
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

var Example = React.createClass({
  displayName: 'Example',

  getInitialState: function() {
    return {
      startDate: null
    };
  },

  handleChange: function(date) {
    this.setState({
      startDate: date
    });
  },

  render: function() {
    return <DatePicker
        {...this.props.field}
        id={this.props.field.name}
        name={this.props.field.name}
        className="explorer__form__input"
        selected={this.state.startDate}
        onChange={this.handleChange} />;
  }
});

const Form = ({
  fields: { q, countries, worldRegions, date },
  handleSubmit,
}) => (
  <form className="explorer__form" onSubmit={handleSubmit}>
    <fieldset>
      <TextField
        field={q} label="Keyword"
        description="Search against the i94_country and i94_region fields."
      />
      <SelectField
        field={countries} label="Countries" options={countryList} multi
        description="Choose which countries that you want to search."
      />
      <SelectField
        field={worldRegions} label="World Regions" options={worldRegionsList} multi
        description="Choose which world regions you want to search."
      />
 
      <div className="explorer__form__group">
        <Example field={date}/>
      </div>

      <div className="explorer__form__group">
        <button className="explorer__form__submit pure-button pure-button-primary" onClick={handleSubmit}>
          <i className="fa fa-paper-plane" /> Search
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
  fields: ['q', 'countries', 'worldRegions', 'date'],
})(Form);
