import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import {
  AddressList, IdentificationList,
  Link, ListItem, Row, UnorderedList
} from './DetailItem';

describe('<AddressList />', () => {
  it('render successfully', () => {
    const value = [
      { address: 'Address #1', city: 'City #1', state: 'State #1',
        postal_code: 'Post #1', country: 'Country #1' },
      { address: 'Address #2', city: 'City #2', state: 'State #2',
        postal_code: 'Post #2', country: 'Country #2' },
      { address: 'Address #3', city: 'City #3', state: 'State #3',
        postal_code: 'Post #3', country: 'Country #3' },
    ];
    const wrapper = shallow(<AddressList value={value} />);
    expect(wrapper.find('.explorer__result-item__addresses').length).toEqual(1);
    expect(wrapper.find(ListItem).length).toEqual(15);
  });
});

describe('<IdentificationList />', () => {
  const validate = (value, listLength, rowLength) => {
    const wrapper = shallow(<IdentificationList value={value} />);
    expect(wrapper.find('.explorer__result-item__identifications').length).toEqual(listLength);
    expect(wrapper.find(Row).length).toEqual(rowLength);
  };

  it('render successfully', () => {
    const value = [
      { type: 'Type #1', number: 'Number #1', country: 'Country #1',
        issue_date: 'Issue Date #1', expiration_date: 'Expiration Date #1' },
      { type: 'Type #2', number: 'Number #2', country: 'Country #2',
        issue_date: 'Issue Date #2', expiration_date: 'Expiration Date #2' },
      { type: 'Type #3', number: 'Number #3', country: 'Country #3',
        issue_date: 'Issue Date #3', expiration_date: 'Expiration Date #3' },
    ];
    validate(value, 1, 15);
  });

  context('when value is undefined', () => {
    it('render nothing', () => {
      validate(undefined, 0, 0);
    });
  });

  context('when value is null', () => {
    it('render nothing', () => {
      validate(null, 0, 0);
    });
  });

  context('when value is invalid', () => {
    it('render nothing', () => {
      validate('a', 0, 0);
      validate({}, 0, 0);
      validate([], 0, 0);
      validate([{}], 0, 0);
    });
  });
});

describe('<ListItem />', () => {
  it('render successfully', () => {
    const value = 'Value #1';
    const wrapper = shallow(<ListItem value={value} />);
    expect(wrapper.contains(<li>Value #1</li>)).toEqual(true);
  });
});

describe('<Row />', () => {
  it('render successfully', () => {
    const { label, value } = { label: 'Label #1', value: 'Value #1' };
    const wrapper = shallow(<Row label={label}>{value}</Row>);
    expect(wrapper.contains(
      <tr>
        <td>{label}</td>
        <td>{value}</td>
      </tr>
    )).toEqual(true);
  });

  context('when value is undefined', () => {
    it('render nothing', () => {
      const { label, value } = { label: 'Nothingness' };
      const wrapper = shallow(<Row label={label}>{value}</Row>);
      expect(wrapper.node).toNotExist();
    });
  });

  context('when value is null', () => {
    it('render nothing', () => {
      const { label, value } = { label: 'Nothingness', value: null };
      const wrapper = shallow(<Row label={label}>{value}</Row>);
      expect(wrapper.node).toNotExist();
    });
  });

  context('when label is undefined', () => {
    it('render without label', () => {
      const { label, value } = { label: undefined, value: 'Value #1' };
      const wrapper = shallow(<Row label={label}>{value}</Row>);
      expect(wrapper.contains(
        <tr>
          <td></td>
          <td>Value #1</td>
        </tr>
      )).toEqual(true);
    });
  });
});
