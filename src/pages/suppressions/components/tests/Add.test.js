import React from 'react';
import { shallow } from 'enzyme';

import { AddTab } from '../Add';

describe('AddTab tests', () => {
  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      submitting: false,
      pristine: true,
      handleSubmit: jest.fn(),
      addSuppression: jest.fn(() => Promise.resolve()),
      reset: jest.fn(),
      showAlert: jest.fn()
    };
    wrapper = shallow(<AddTab {...props} />);
    instance = wrapper.instance();
  });

  it('should render add form', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable fields when submitting', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should make form submitable when dirty and not submitting', () => {
    wrapper.setProps({ pristine: false, submitting: false });
    expect(wrapper).toMatchSnapshot();
  });

  describe('onSubmit tests', () => {
    it('displays an alert and redirects after successful upload', async() => {
      const args = {
        subaccount: 999,
        recipient: 'foo@bar.com',
        description: 'desc'
      };

      await instance.onSubmit(args);

      expect(instance.props.addSuppression).toHaveBeenCalledWith({
        recipient: 'foo@bar.com',
        description: 'desc'
      }, 999);
      expect(instance.props.showAlert).toHaveBeenCalledWith({ message: 'Successfully updated your suppression list', type: 'success' });
      expect(instance.props.reset).toHaveBeenCalled();
    });

    it('catches errors when adding suppression', async() => {
      wrapper.setProps({ addSuppression: jest.fn(() => Promise.reject(new Error('failed'))) });
      const args = {
        subaccount: 999,
        recipient: 'foo@bar.com',
        description: 'desc'
      };

      await instance.onSubmit(args);
      expect(instance.props.showAlert).not.toHaveBeenCalled();
      expect(instance.props.reset).not.toHaveBeenCalled();
    });
  });

  describe('atLeastOne validator', () => {
    it('should returned undefined if trans or non-trans is true', () => {
      expect(instance.atLeastOne(true, { transactional: true })).toEqual(undefined);
      expect(instance.atLeastOne(true, { non_transactional: true })).toEqual(undefined);
    });

    it('should return error if both trans and non-trans are false', () => {
      expect(instance.atLeastOne(true, { })).toEqual('You must select at least 1 one of Transactional or Non-Transactional');
    });

  });
});



