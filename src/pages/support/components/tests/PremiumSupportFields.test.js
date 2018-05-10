import React from 'react';
import { shallow } from 'enzyme';
import PremiumSupportFields from '../PremiumSupportFields';

let wrapper;

describe('PremiumSupportFields', () => {
  beforeEach(() => {
    wrapper = shallow(<PremiumSupportFields />);
  });

  it('default state', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
