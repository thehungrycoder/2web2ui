import React from 'react';
import { ChangePlanPage } from '../ChangePlanPage';
import { shallow } from 'enzyme';

jest.mock('src/actions/billing');

describe('Page: ChangePlanPage', () => {
  let wrapper;
  let instance;

  const props = {
    account: {},
    history: { push: jest.fn() },
    getPlans: jest.fn(),
    getBillingCountries: jest.fn(),
    showAlert: jest.fn(),
    billingCreate: jest.fn(() => Promise.resolve()),
    billingUpdate: jest.fn(() => Promise.resolve()),
    updateSubscription: jest.fn(() => Promise.resolve())
  };

  beforeEach(() => {
    wrapper = shallow(<ChangePlanPage {...props} />);
    instance = wrapper.instance();
  });

  it('should get plans and countries on mount', () => {
    const plansSpy = jest.spyOn(wrapper.instance().props, 'getPlans');
    const countrySpy = jest.spyOn(wrapper.instance().props, 'getBillingCountries');
    wrapper.instance().componentWillMount();
    expect(plansSpy).toHaveBeenCalled();
    expect(countrySpy).toHaveBeenCalled();
  });

  it('should render form if allowed to change plan', () => {
    wrapper.setProps({ canChangePlan: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render form if not allowed to change plan', () => {
    wrapper.setProps({ canChangePlan: false });
    expect(wrapper).toMatchSnapshot();
  });

  describe('onSubmit tests', () => {
    it('should call bilingCreate when no billing exists', async() => {
      await instance.onSubmit({ key: 'value' });
      expect(instance.props.billingCreate).toHaveBeenCalledWith({ key: 'value' });
      expect(instance.props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    it('should update subscription when billing exists and using saved cc', async() => {
      wrapper.setProps({ account: { billing: true }});
      await instance.onSubmit({ key: 'value' });
      expect(instance.props.billingUpdate).toHaveBeenCalledWith({ key: 'value' });
      expect(instance.props.updateSubscription).not.toHaveBeenCalled();
      expect(instance.props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });

    });

    it('should update billing when billing exists but enter new cc info', async() => {
      wrapper.setProps({ account: { billing: true }});
      await instance.onSubmit({ planpicker: { code: 'free' }}, true);
      expect(instance.props.updateSubscription).toHaveBeenCalledWith('free');
      expect(instance.props.billingUpdate).not.toHaveBeenCalled();
      expect(instance.props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    it('should show error alert on failure', async() => {
      wrapper.setProps({ billingCreate: jest.fn(() => Promise.reject(new Error('failure'))) });
      await instance.onSubmit({ key: 'value' });
      expect(instance.props.billingCreate).toHaveBeenCalled();
      expect(instance.props.history.push).not.toHaveBeenCalled();
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Plan Update Failed', details: 'failure' });

    });
  });

});
