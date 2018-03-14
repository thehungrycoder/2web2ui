import React from 'react';
import { shallow } from 'enzyme';
import { EditTab } from '../EditTab';

const subaccount = {
  id: 123,
  name: 'Caisey Neistat',
  status: 'active',
  compliance_status: 'active'
};

// actions
const editSubaccount = jest.fn(() => Promise.resolve());
const getSubaccount = jest.fn();
const showAlert = jest.fn();

const props = {
  loading: false,
  subaccount: subaccount,
  editSubaccount,
  getSubaccount,
  showAlert
};

let wrapper;

describe('EditTab', () => {
  beforeEach(() => {
    wrapper = shallow(<EditTab {...props} />);
  });

  describe('Render', () => {
    test('normal props', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('loading', () => {
      wrapper.setProps({ loading: true });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('onSubmit', () => {
    const newValues = {
      name: 'Francine Neistat',
      status: 'suspended',
      ipPool: 'kiddy'
    };

    test('success', async() => {
      await wrapper.instance().onSubmit(newValues);
      expect(editSubaccount).toHaveBeenCalledWith(subaccount.id, {
        name: newValues.name,
        status: newValues.status,
        ip_pool: newValues.ipPool
      });
      expect(showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Updated subaccount' });
      expect(getSubaccount).toHaveBeenCalledWith(subaccount.id);
    });
  });
});
