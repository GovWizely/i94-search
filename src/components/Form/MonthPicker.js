import React, { PropTypes } from 'react';
import Picker from 'react-month-picker';

let MonthBox = React.createClass({
    propTypes: {
      value: React.PropTypes.string, 
      onClick: React.PropTypes.func,
      field: PropTypes.object.isRequired,
    }, 

    getInitialState() {
      return {
          value: this.props.value || 'N/A'
      }
    },

    componentWillReceiveProps(nextProps){
      this.setState({
          value: nextProps.value || 'N/A'
      })
    },

    render() {
      return (
        <div onClick={this._handleClick}>
          <input type="text" className="explorer__form__input" id={this.props.field.name} name={this.props.field.name} value={this.state.value} {...this.props.field}/>
        </div>
      )
    },

    _handleClick(e) {
      this.props.onClick && this.props.onClick(e)
    }
});


let MonthPicker = React.createClass({
  propTypes: {
    field: PropTypes.object.isRequired,
  },

  getDefaultProps () {
    return {
    }
  },
  
  getInitialState() {
    return {
      mrange: {from: {year: 2015, month: 1}, to: {year: 2016, month: 3}}
    }
  },

  componentWillReceiveProps(nextProps){
    this.setState({
    })
  },

  componentDidMount () {},

  render() {

      let pickerLang = {
              months: ['Jan', 'Feb', 'Mar', 'Spr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              from: 'From', to: 'To'
          },
          mrange = this.state.mrange

      let makeText = m => {
          if (m && m.year && m.month) return (pickerLang.months[m.month-1] + '. ' + m.year)
          return '?'
      }

      return (
        <div className="explorer__form__group">
            <label>Date</label>
            <p>Choose a range of months.</p>
            <div className="edit">
                <Picker
                    ref="pickRange"
                    years={{min: 1999}}
                    range={mrange}
                    lang={pickerLang}
                    theme="dark"
                    onChange={this.handleRangeChange}
                    onDismiss={this.handleRangeDissmis}
                    >
                    <MonthBox field={this.props.field} value={makeText(mrange.from) + ' ~ ' + makeText(mrange.to)} onClick={this._handleClickRangeBox} />
                </Picker>
            </div>
        </div>
      )
  },

  handleClickMonthBox(e) {
      this.refs.pickAMonth.show()
  },

  _handleClickRangeBox(e) {
      this.refs.pickRange.show()
  },

  handleRangeChange(value, text, listIndex) {
      //
  },

  handleRangeDissmis(value) {
      this.setState( {mrange: value} )
  }
});

export default MonthPicker;
