import { shallow } from 'enzyme';
import React from 'react';
import Downshift from 'downshift';

import PlanPickerWrapper from '../PlanPickerWrapper';

const selfServe = {
  self_serve: true,
  plan_volume: 5,
  name: 'Just 5'
};

const notSelfServe = {
  self_serve: false,
  plan_volume: 10,
  name: 'Just 10'
};

const pending = {
  effective_date: 'tomorrow',
  name: 'More than 10!'
};

it('renders PlanPicker if self-serve', () => {
  const wrapper = shallow(<PlanPickerWrapper plans={[]} subscription={selfServe}/>);
  expect(wrapper).toMatchSnapshot();
});

it('does not render PlanPicker for non-self-serve customers', () => {
  const wrapper = shallow(<PlanPickerWrapper plans={[]} subscription={notSelfServe}/>);
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly with a pending plan change', () => {
  const wrapper = shallow(<PlanPickerWrapper plans={[]} subscription={notSelfServe} pendingSubscription={pending}/>);
  expect(wrapper).toMatchSnapshot();
});
