import { shallow } from 'enzyme';
import React from 'react';

import { CreatePage } from '../CreatePage';

// actions
const listSubaccountGrants = jest.fn();
const listPools = jest.fn();
const createSubaccount = jest.fn(() => Promise.resolve({ subaccount_id: 123 }));
const push = jest.fn();
const showAlert = jest.fn();

const props = {
  loading: false,
  listPools,
  listSubaccountGrants,
  createSubaccount,
  showAlert,
  history: { push }
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<CreatePage {...props} />);
});

test('render', () => {
  expect(listSubaccountGrants).toHaveBeenCalled();
  expect(listPools).toHaveBeenCalled();
  expect(wrapper).toMatchSnapshot();
});

describe('onSubmit', () => {
  const values = ['a', 'list', 'of', 'values'];

  test('success', async() => {
    await wrapper.instance().onSubmit(values);
    expect(createSubaccount).toHaveBeenCalledWith(values);
    expect(showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subaccount 123 created' });
    expect(push).toHaveBeenCalledWith('/account/subaccounts/123');
  });
});
