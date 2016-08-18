import React, { Component, PropTypes } from 'react';
import Detail from './Detail';

class Item extends Component {
  static propTypes = {
    result: PropTypes.object.isRequired,
    visibleFields: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  state = { expand: false };

  onClick(e) {
    e.preventDefault();
    this.setState({ expand: !this.state.expand });
  }

  render() {
    const { i94_country_or_region } = this.props.result;
    const { expand } = this.state;
    return (
      <div className="explorer__result-item">
        <a href="#" className="explorer__result-item__label" onClick={this.onClick}>{i94_country_or_region}</a>
        {expand ? <Detail result={this.props.result} visibleFields={this.props.visibleFields} /> : null}
      </div>
    );
  }
}

export default Item;
