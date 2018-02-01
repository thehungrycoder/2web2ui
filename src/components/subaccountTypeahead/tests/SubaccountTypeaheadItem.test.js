import { shallow } from 'enzyme';
import React from 'react';
import SubaccountTypeaheadItem from '../SubaccountTypeaheadItem';

describe('Subaccount Typeahead Item', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<SubaccountTypeaheadItem name='a name' id={101} />);
    expect(wrapper).toMatchSnapshot();
  });
});
