import React, { Component, PropTypes } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';
import { reduxForm, change } from 'redux-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import FormMessages from 'redux-form-validation';
import { generateValidation } from 'redux-form-validation';
import './Form.scss';
import percentChangeList from '../../fixtures/percent_change';
import { isEmpty } from '../../utils/lodash';
import { requestDateOptions } from '../../actions/form_options';

const $ = window.$;

 const validations = {
     startDate: {
       required: true
     },
     percentChange: {
       required: true
     },
     selectOptions: {
      required: false
     },
    countries: {
      required: false
     },
    worldRegions: {
      required: false
     },
    nttoGroups: {
      required: false
     }
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
        joinValues = {true}
        delimiter = {','}
        simpleValue = {true}
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

const DateField = ({ field, setRef }) => {
  return (
    <input type="month" ref={setRef} className="explorer__form__input" id={field.name} {...field} />
  );
};
DateField.propTypes = {
  field: PropTypes.object.isRequired,
}

const CountriesField = ({field, options}) => (
  <SelectField
    field={field} label="All Countries" options={options} multi
    description="Choose one or more countries to search."
  />
)

const WorldRegionsField = ({field, options}) => (
  <SelectField
    field={field} label="ITA World Regions" options={options} multi
    description="Choose one or more world regions to search."
  />
)

const NttoGroupsField = ({field, options}) => (
  <SelectField
    field={field} label="NTTO Groups" options={options} multi
    description="Choose one or more NTTO groups to search."
  />
)

class Form extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    formOptions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {selectField: 'countries'};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({selectField: value});
  }

  componentDidMount(){
    const date_range = this.props.formOptions.dateRange;
    const min_month = isEmpty(date_range) ? '2000-01' : date_range[0];
    const max_month = isEmpty(date_range) ? '2016-03' : date_range[1];
    $('input[type=month]').MonthPicker({ StartYear: 2016, ShowIcon: false, MinMonth: min_month, MaxMonth: max_month })
  }

  componentDidUpdate(){
    const date_range = this.props.formOptions.dateRange;
    const min_month = isEmpty(date_range) ? '2000-01' : date_range[0];
    const max_month = isEmpty(date_range) ? '2016-03' : date_range[1];
    $('input[type=month]').MonthPicker({ StartYear: 2016, ShowIcon: false, MinMonth: min_month, MaxMonth: max_month })
  }

  render() {
    const { 
      fields: { selectOptions, countries, worldRegions, startDate, nttoGroups, percentChange }, 
      handleSubmit,
      formOptions 
    } = this.props;

    let selectField;
    if (selectOptions.value == 'countries' || selectOptions.value === ''){
      validations.countries = {required: true}
      validations.worldRegions = {required: false}
      validations.nttoGroups = {required: false}
      selectField = <CountriesField field={countries} options={formOptions.countries}/>;
    }
    else if (selectOptions.value == 'worldRegions'){
      validations.countries = {required: false}
      validations.worldRegions = {required: true}
      validations.nttoGroups = {required: false}
      selectField =  <WorldRegionsField field={worldRegions} options={formOptions.worldRegions}/>;
    }
    else if (selectOptions.value == 'nttoGroups'){
      validations.countries = {required: false}
      validations.worldRegions = {required: false}
      validations.nttoGroups = {required: true}
      selectField = <NttoGroupsField field={nttoGroups} options={formOptions.nttoGroups}/>;
    }

    return (
      <form className="explorer__form" onSubmit={handleSubmit}>
        <fieldset>
          <div className="explorer__form__group">
            <label>Select an option to search by Countries, World Regions, or NTTO Groups</label>
            <RadioGroup name='selectOptions' selectedValue={selectOptions.value ? selectOptions.value : 'countries'}>
              <Radio {...selectOptions} value="countries" /> Countries
              <Radio {...selectOptions} value="worldRegions" /> World Regions
              <Radio {...selectOptions} value="nttoGroups" /> NTTO Groups
            </RadioGroup>
          </div>

          {selectField}
    
          <FormMessages field={countries} >
               <p className="validation-error" when="required">
                 Must enter at least one country.
               </p>
          </FormMessages>
          <FormMessages field={worldRegions} >
               <p className="validation-error" when="required">
                 Must enter at least one world region.
               </p>
          </FormMessages>
          <FormMessages field={nttoGroups} >
               <p className="validation-error" when="required">
                 Must enter at least one NTTO group.
               </p>
          </FormMessages>

          <div className="explorer__form__row">
            <div className="explorer__form__row_group">
              <div className="explorer__form__group">
                <label>Choose Starting Month</label>
                <DateField field={startDate} setRef={this.setRef} />
              </div>
            </div>
          </div>

          <FormMessages field={startDate} >
               <p className="validation-error" when="required">
                 Must enter a starting month.
               </p>
          </FormMessages>

          <SelectField
            field={percentChange} label="Report Interval" options={percentChangeList}
            description="Choose a comparison interval.  This compares the chosen interval containing the starting month against the corresponding interval in the next year."
          />

          <FormMessages field={percentChange} >
               <p className="validation-error" when="required">
                 Must enter a report interval.
               </p>
          </FormMessages>

          <div className="explorer__form__group">
            <button className="explorer__form__submit pure-button pure-button-primary" onClick={handleSubmit}>
              <i className="fa fa-paper-plane" /> Generate Reports
            </button>

          </div>
        </fieldset>
      </form>
    );
  }
}

export default reduxForm({
  form: 'form',
  fields: ['selectOptions', 'countries', 'worldRegions', 'startDate', 'nttoGroups', 'percentChange'],
  ...generateValidation(validations)
})(Form);
