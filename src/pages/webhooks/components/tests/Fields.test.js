import React from 'react';
import { shallow } from 'enzyme';
import {
    NameField,
    EventsRadioGroup,
    AuthDropDown,
    BasicAuthFields,
    OAuth2Fields
} from '../Fields.js'

it('should render NameField', () => {
  const wrapper = shallow(<NameField />);

  expect(wrapper).toMatchSnapshot();
});

it('should render EventsRadioGroup', () => {
  const wrapper = shallow(<EventsRadioGroup />);

  expect(wrapper).toMatchSnapshot();
});

it('should render AuthDropDown', () => {
  const wrapper = shallow(<AuthDropDown />);

  expect(wrapper).toMatchSnapshot();
});

it('should render BasicAuthFields', () => {
  const wrapper = shallow(<BasicAuthFields />);

  expect(wrapper).toMatchSnapshot();
});

it('should render BasicAuthFields', () => {
  const wrapper = shallow(<BasicAuthFields />);

  expect(wrapper).toMatchSnapshot();
});

it('should render OAuth2Fields', () => {
  const wrapper = shallow(<OAuth2Fields />);

  expect(wrapper).toMatchSnapshot();
});
