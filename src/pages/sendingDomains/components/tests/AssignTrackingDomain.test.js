import { shallow } from 'enzyme';
import React from 'react';

import { AssignTrackingDomain } from '../AssignTrackingDomain';

describe('Component: AssignTrackingDomain form', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      subaccount: 100,
      handleSubmit: jest.fn(),
      listTrackingDomains: jest.fn(),
      sendingDomain: 'send.to.me',
      showAlert: jest.fn(),
      updateSendingDomain: jest.fn(() => Promise.resolve()),
      pristine: false,
      submitting: false,
      trackingDomains: [
        {
          label: 'track.me',
          value: 'track'
        },
        {
          label: 'dont.track.me',
          value: 'dont-track'
        }
      ],
      listLoading: false
    };

    wrapper = shallow(<AssignTrackingDomain {...props}/>);
  });

  it('should render form with initial values', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render panel loading component when data is loading', () => {
    wrapper.setProps({ listLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should have button disabled when submitting', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should have button disabled when form is pristine', () => {
    wrapper.setProps({ pristine: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call updateTrackingDomain on submit', () => {
    wrapper.find('form').simulate('submit');
    expect(wrapper.instance().props.handleSubmit).toHaveBeenCalled();
  });

  it('should show success alert on update of sending domain', async() => {
    const form = wrapper.instance();
    await form.updateTrackingDomain({ trackingDomain: 'trackme.com' });
    expect(form.props.updateSendingDomain).toHaveBeenCalledWith({
      sendingDomain: 'send.to.me',
      subaccount: 100,
      tracking_domain: 'trackme.com'
    });
    expect(form.props.showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'Tracking domain assignment updated.'
    });
  });

  it('should show error alert on failed sending domain update', async() => {
    wrapper.setProps({ updateSendingDomain: jest.fn(() => Promise.reject({ message: 'update failed' })) });
    const form = wrapper.instance();
    await form.updateTrackingDomain({ trackingDomain: 'trackme.com' });
    expect(form.props.showAlert).toHaveBeenCalledWith({
      type: 'error',
      message: 'Could not update tracking domain assignment.',
      details: 'update failed'
    });
  });

  it('should load tracking domain list on mount', () => {
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().props.listTrackingDomains).toHaveBeenCalledWith(100);
  });

});
