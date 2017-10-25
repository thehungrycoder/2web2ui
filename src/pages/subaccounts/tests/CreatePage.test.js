import { shallow } from 'enzyme';
import React from 'react';

import { CreatePage } from '../CreatePage';

const props = {
  loading: false,
  listPools: jest.fn(),
  listSubaccountGrants: jest.fn(),
  createSubaccount: jest.fn(() => Promise.resolve()),
  history: { push: jest.fn() }
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<CreatePage {...props} />)
})

it('renders correctly', () => {
  const subaccountGrantsSpy = jest.spyOn(wrapper.instance().props, 'listSubaccountGrants');
  const ipPoolsSpy = jest.spyOn(wrapper.instance().props, 'listPools');

  expect(subaccountGrantsSpy).toHaveBeenCalled();
  expect(ipPoolsSpy).toHaveBeenCalled();
  expect(wrapper).toMatchSnapshot();
});

it('submits correctly', () => {
  const spy = jest.spyOn(wrapper.instance().props, 'createSubaccount');
  wrapper.instance().onSubmit('test');
  expect(spy).toHaveBeenCalledWith('test');
});
