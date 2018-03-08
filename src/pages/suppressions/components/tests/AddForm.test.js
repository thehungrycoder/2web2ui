import React from 'react';
import { shallow } from 'enzyme';

import { AddForm } from '../AddForm';

describe('AddForm tests', () => {
  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      submitting: false,
      pristine: true,
      handleSubmit: jest.fn(),
      createOrUpdateSuppressions: jest.fn(() => Promise.resolve()),
      reset: jest.fn(),
      showAlert: jest.fn()
    };
    wrapper = shallow(<AddForm {...props} />);
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
        description: 'desc',
        types: {
          non_transactional: true,
          transactional: false
        }
      };

      await instance.onSubmit(args);

      expect(instance.props.createOrUpdateSuppressions).toHaveBeenCalledWith([{
        recipient: 'foo@bar.com',
        description: 'desc',
        type: 'non_transactional'
      }], 999);
      expect(instance.props.showAlert).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
      expect(instance.props.reset).toHaveBeenCalled();
    });
  });

  describe('atLeastOne validator', () => {
    it('should returned undefined if trans or non-trans is true', () => {
      expect(instance.atLeastOne(true, { types: { non_transactional: false, transactional: true }})).toEqual(undefined);
      expect(instance.atLeastOne(true, { types: { non_transactional: false, transactional: true }})).toEqual(undefined);
    });

    it('should return error if both trans and non-trans are false', () => {
      const values = {
        types: {
          non_transactional: false,
          transactional: false
        }
      };

      expect(instance.atLeastOne(true, values)).toMatch(/select at least one/);
    });
  });
});
