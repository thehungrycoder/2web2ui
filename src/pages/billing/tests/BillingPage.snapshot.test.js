import { shallow } from 'enzyme';
import React from 'react';

import { BillingPage } from '../BillingPage';

const props = {
  account: {
    subscription: {
      code: 'free-0817'
    }
  },
  billing: {
    countries: [],
    countriesLoading: false,
    plans: [],
    plansLoading: false
  }
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<BillingPage {...props} />);
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly when loading', () => {
  wrapper.setProps({ billing: { countriesLoading: true }});
  expect(wrapper).toMatchSnapshot();
});
