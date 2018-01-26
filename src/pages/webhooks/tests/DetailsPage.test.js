import { shallow } from 'enzyme';
import React from 'react';

import { WebhooksDetails } from '../DetailsPage';

describe('Page: Webhook Details', () => {
  const props = {
    getWebhook: jest.fn(),
    deleteWebhook: jest.fn(() => Promise.resolve()),
    history: {
      push: jest.fn()
    },
    webhook: {
      id: 'my-id',
      events: ['delivery', 'injection'],
      name: 'My Hooky'
    },
    location: {
      pathname: '/webhooks/details/my-id/test'
    },
    match: {
      params: {
        id: 'my-id'
      }
    }
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<WebhooksDetails {...props} />);
  });

  it('should render happy path', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should return loading component when id in route is diff than in redux store', () => {
    wrapper.setProps({ match: { params: { id: 'diff-id' }}});
    expect(wrapper).toMatchSnapshot();
  });

  it('should return loading component if no events in redux store', () => {
    wrapper.setProps({ webhook: { events: null }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should call getWebhook on component mount', () => {
    const instance = wrapper.instance();
    instance.componentDidMount();
    expect(instance.props.getWebhook).toHaveBeenCalledWith('my-id');
  });

  it('should delete webhook and return to list page', async() => {
    const instance = wrapper.instance();
    await instance.deleteWebhook();
    expect(instance.props.deleteWebhook).toHaveBeenCalledWith('my-id');
    expect(instance.props.history.push).toHaveBeenCalledWith('/webhooks/');
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
