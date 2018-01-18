import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import ChunkLoading from '../ChunkLoading';

const CustomLoading = () => '';

cases('ChunkLoading', (props) => {
  const wrapper = shallow(<ChunkLoading {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'should return null': {},
  'should render loading': {
    pastDelay: true
  },
  'should render custom loading': {
    LoadingComponent: CustomLoading,
    pastDelay: true
  }
});
