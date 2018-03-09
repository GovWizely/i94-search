import React, { Component, PropTypes } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';
import { Field, reduxForm, change, untouch } from 'redux-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { values } from '../../utils/lodash';

import './Form.scss';
import percentChangeList from '../../fixtures/percent_change';
import { isEmpty } from '../../utils/lodash';
import { requestDateOptions } from '../../actions/form_options';

const $ = window.$;
const required = value => (value ? undefined : 'This value is required.');

const SelectField = ({ input, name, description, label = 'Untitled', options, meta, multi = false, handleChange = null }) => (
  <div>
    <label htmlFor={name}>{label}</label>
    {description ? <p>{description}</p> : null}
    <div>
      <Select
        {...input}
        inputProps={{'id': name}}
        name={name}
        options={options}
        value={input.value}
        multi={multi}
        autoBlur={true}
        onBlur={(option) => input.onBlur(option.value)}
        simpleValue = {true}
        onChange={value => {
          input.onChange(value)
          if (handleChange){
            handleChange(value, name);
          }
        }}
      />
    </div>
     <div className="validation-error">
      {meta.error && meta.touched &&
          <span>
            {meta.error}
          </span>}
    </div>
  </div>
);
SelectField.propTypes = {
  description: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  multi: PropTypes.bool,
};

const DateField = ({ input, meta }) => {
  return (
    <div>
      <input {...input} type="month" className="explorer__form__input"  />
      <div className="validation-error">
        {meta.error && meta.touched &&
            <span>
              {meta.error}
            </span>}
      </div>
    </div>
  );
};

const CountriesField = ({options, handleDropdownChange}) => (
  <div className="explorer__form__group">
    <Field name="countries" validate={required} component={ props =>
      <SelectField 
        input={props.input}
        name="countries" 
        options={options} 
        meta={props.meta}
        handleChange={handleDropdownChange} 
        label="All Countries"
        description="Choose one or more countries to search."
        multi={true}
      />
    }/>
  </div>
)

const WorldRegionsField = ({options, handleDropdownChange}) => (
  <div className="explorer__form__group">
    <Field name="worldRegions" validate={required} component={ props =>
      <SelectField 
        input={props.input}
        name="worldRegions" 
        options={options} 
        meta={props.meta}
        handleChange={handleDropdownChange} 
        label="World Regions"
        description="Choose one or more world regions to search."
        multi={true}
      />
    }/>
  </div>
)

const NttoGroupsField = ({options, handleDropdownChange}) => (
  <div className="explorer__form__group">
    <Field name="nttoGroups" validate={required} component={ props =>
      <SelectField 
        input={props.input}
        name="nttoGroups" 
        options={options} 
        meta={props.meta}
        handleChange={handleDropdownChange} 
        label="NTTO Groups"
        description="Choose one or more NTTO groups to search."
        multi={true}
      />
    }/>
  </div>
)

class Form extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    formOptions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    const selectedField = localStorage.getItem('selectedField') ? localStorage.getItem('selectedField') : 'countries';
    this.state = {selectedField: selectedField};
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.setMonthPicker = this.setMonthPicker.bind(this);
  }

  handleRadioChange(value) {
    const { dispatch } = this.props;
    dispatch(change('form', this.state.selectedField, null));
    dispatch(untouch('form', this.state.selectedField));
    localStorage.setItem('selectedField', value);
    this.setState({selectedField: value});
  }

  handleDropdownChange(value, field){
    return this.props.dispatch(requestDateOptions(value, field));
  }

  setMonthPicker(){
    const date_range = this.props.formOptions.dateRange;
    const min_month = isEmpty(date_range) ? '2000-01' : date_range[0];
    const max_month = isEmpty(date_range) ? '2016-03' : date_range[1];
    $('input[type=month]').MonthPicker({ StartYear: 2016, ShowIcon: false, MinMonth: min_month, MaxMonth: max_month })
  }

  componentDidMount(){
    this.setMonthPicker();
  }

  componentDidUpdate(){
    this.setMonthPicker();
  }

  render() {
    const { handleSubmit, formOptions } = this.props;
    const { selectedField } = this.state;
    let selectField;
    if (selectedField === 'countries' || selectedField === null){
      selectField = <CountriesField options={formOptions.countries} handleDropdownChange={this.handleDropdownChange} />;
    }
    else if (selectedField == 'worldRegions'){
      selectField =  <WorldRegionsField options={formOptions.worldRegions} handleDropdownChange={this.handleDropdownChange} />;
    }
    else if (selectedField == 'nttoGroups'){
      selectField = <NttoGroupsField options={formOptions.nttoGroups} handleDropdownChange={this.handleDropdownChange}/>;
    }

    return (
      <form className="explorer__form" onSubmit={handleSubmit}>
        <fieldset>
          <div className="explorer__form__group">
            <label>Select an option to search by Countries, World Regions, or NTTO Groups</label>
            <Field name="selectOptions" component={ props => 
            <RadioGroup name='selectOptions' selectedValue={selectedField ? selectedField : 'countries'} onChange={this.handleRadioChange}>
              <Radio value="countries" /> Countries
              <Radio value="worldRegions" /> World Regions
              <Radio value="nttoGroups" /> NTTO Groups
            </RadioGroup>
            } />
          </div>

          {selectField}
  
          <div className="explorer__form__row">
            <div className="explorer__form__row_group">
              <div className="explorer__form__group">
                <label>Choose Starting Month</label>
                <Field name="startDate" validate={required} component={ props =>
                    <DateField input={props.input} meta={props.meta} />
                  }
                />
              </div>
            </div>
          </div>


              <div className="explorer__form__group">
                <Field name="percentChange" validate={required} component={ props =>
                    <SelectField
                      input={props.input} 
                      meta={props.meta}
                      name="percentChange"
                      multi={false}
                      label="Report Interval" 
                      options={percentChangeList}
                      description="Choose a comparison interval.  This compares the chosen interval containing the starting month against the corresponding interval in the next year."
                    />
                  }
                />
              </div>


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
  form: 'form'
})(Form);
