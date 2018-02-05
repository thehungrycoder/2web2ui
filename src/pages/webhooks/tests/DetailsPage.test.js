import { shallow } from 'enzyme';
import React from 'react';

import { WebhooksDetails } from '../DetailsPage';

describe('Page: Webhook Details', () => {

  let wrapper;

  beforeEach(() => {
    const props = {
      getWebhook: jest.fn(() => Promise.resolve()),
      deleteWebhook: jest.fn(() => Promise.resolve()),
      history: {
        push: jest.fn()
      },
      webhook: {
        id: 'my-id',
        events: ['delivery', 'injection'],
        name: 'My Hooky',
        subaccount: 101
      },
      location: {
        pathname: '/webhooks/details/my-id/test'
      },
      match: {
        params: {
          id: 'my-id'
        }
      },
      hasSubaccounts: false,
      subaccountId: 101,
      showAlert: jest.fn()
    };

    wrapper = shallow(<WebhooksDetails {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render happy path', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Loading')).toHaveLength(0);
  });

  it('should return loading component when id in route is diff than in redux store', () => {
    wrapper.setProps({ match: { params: { id: 'diff-id' }}});
    expect(wrapper.find('Loading')).toHaveLength(1);
  });

  it('should return loading component if no events in redux store', () => {
    wrapper.setProps({ webhook: { events: null }});
    expect(wrapper.find('Loading')).toHaveLength(1);
  });

  it('should call getWebhook on component mount', () => {
    const instance = wrapper.instance();
    instance.componentDidMount();
    expect(instance.props.getWebhook).toHaveBeenCalledWith({ id: 'my-id', subaccount: 101 });
  });

  it('should catch a getWebhook error', async() => {
    wrapper.setProps({ getWebhook: jest.fn(() => Promise.reject({ message: 'error' })) });
    const instance = wrapper.instance();
    await instance.componentDidMount();
    expect(instance.props.getWebhook).toHaveBeenCalledWith({ id: 'my-id', subaccount: 101 });
    expect(instance.props.history.push).toHaveBeenCalledWith('/webhooks/');
    expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Unable to find webhook', details: 'error' });
  });

  it('should delete webhook and return to list page', async() => {
    const instance = wrapper.instance();
    await instance.deleteWebhook();
    expect(instance.props.deleteWebhook).toHaveBeenCalledWith({ id: 'my-id', subaccount: 101 });
    expect(instance.props.history.push).toHaveBeenCalledWith('/webhooks/');
    expect(instance.props.showAlert).toHaveBeenCalledWith({ message: 'Webhook deleted', type: 'success' });
  });

  it('should catch a delete error', async() => {
    wrapper.setProps({ deleteWebhook: jest.fn(() => Promise.reject({ message: 'error' })) });
    const instance = wrapper.instance();
    await instance.deleteWebhook();
    expect(instance.props.deleteWebhook).toHaveBeenCalledWith({ id: 'my-id', subaccount: 101 });
    expect(instance.props.history.push).not.toHaveBeenCalledWith('/webhooks/');
    expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Unable to delete webhook', details: 'error' });
  });

  it('should toggle showDelete state on toggleDelete', () => {
    const instance = wrapper.instance();
    const stateSpy = jest.spyOn(instance, 'setState');
    instance.toggleDelete();
    expect(stateSpy).toHaveBeenCalledWith({ showDelete: true });
    instance.toggleDelete();
    expect(stateSpy).toHaveBeenCalledWith({ showDelete: false });
  });

});
