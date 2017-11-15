import React from 'react';
import { shallow } from 'enzyme';
import { ApiKeysTab, getRowData } from '../ApiKeysTab';

const props = {
  loading: false,
  keys: ['an array of keys']
};

let wrapper;

describe('ApiKeysTab', () => {
  beforeEach(() => {
    wrapper = shallow(<ApiKeysTab {...props} />);
  });

  test('normal props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('loading', () => {
    wrapper.setProps({ loading: true })
    expect(wrapper).toMatchSnapshot();
  });

  test('empty', () => {
    wrapper.setProps({ keys: [] });
    expect(wrapper).toMatchSnapshot()
  });
});

test('getRowData', () => {
  expect(getRowData({ id: 12313, label: 'test', short_key: 'cdwa' })).toMatchSnapshot();
});
