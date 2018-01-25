/* eslint max-lines: ["error", 200] */
import { shallow } from 'enzyme';
import React from 'react';

import { WebhooksCreate } from '../CreatePage';

describe('Page: Webhook Create', () => {
  const props = {
    eventDocs: true,
    getEventDocs: jest.fn(),
    createWebhook: jest.fn(() => Promise.resolve()),
    history: {
      push: jest.fn()
    },
    eventsLoading: false
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<WebhooksCreate {...props} />);
  });

  it('should render happy path', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should build proper events tree', () => {
    wrapper.setProps({ eventDocs: {
      key1: {
        description: 'desc for key 1',
        display_name: 'Key 1',
        events: {
          event1: {
            description: 'desc for event 1',
            display_name: 'Event 1'
          },
          event2: {
            description: 'desc for event 2',
            display_name: 'Event 2'
          }
        }
      },
      key2: {
        description: 'desc for key 2',
        display_name: 'Key 2',
        events: {
          event3: {
            description: 'desc for event 3',
            display_name: 'Event 3'
          },
          event4: {
            description: 'desc for event 4',
            display_name: 'Event 4'
          }
        }
      }
    }});

    expect(wrapper).toMatchSnapshot();
  });

  it('should show loading component while events are loading', () => {
    wrapper.setProps({ eventsLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call createWebhook on submit of form', () => {
    const createSpy = jest.spyOn(wrapper.instance(), 'createWebhook');
    wrapper.instance().createWebhook.mockImplementation(jest.fn());
    wrapper.find('Connect(ReduxForm)').simulate('submit');
    expect(createSpy).toHaveBeenCalled();
  });

  describe('createWebhook tests', () => {

    it('should redirect to a diff url on render', async() => {
      const instance = wrapper.instance();
      await instance.createWebhook({
        name: 'my webhook',
        target: 'http://url.com'
      }, [
        {
          events: [
            { key: 'event1' },
            { key: 'event2' },
            { key: 'event3' }
          ]
        }
      ]);

      expect(instance.props.createWebhook).toHaveBeenCalledWith({
        name: 'my webhook',
        target: 'http://url.com',
        events: ['event1', 'event2', 'event3']
      });
      expect(instance.props.history.push).toHaveBeenCalledWith('/webhooks');
    });

    it('should only pass in checked events', async() => {
      const instance = wrapper.instance();
      await instance.createWebhook({
        name: 'my webhook',
        target: 'http://url.com',
        eventsRadio: 'select',
        message_event: ['foo', 'bar'],
        track_event: ['open', 'click'],
        relay_event: ['relay']
      });

      expect(instance.props.createWebhook).toHaveBeenCalledWith({
        name: 'my webhook',
        target: 'http://url.com',
        events: ['foo', 'bar', 'open', 'click', 'relay']
      });
      expect(instance.props.history.push).toHaveBeenCalledWith('/webhooks');
    });

    it('should set appropriate values for basic auth webhook', async() => {
      const instance = wrapper.instance();
      await instance.createWebhook({
        name: 'my webhook',
        target: 'http://url.com',
        eventsRadio: 'select',
        message_event: ['event'],
        auth: 'basic',
        basicUser: 'user',
        basicPass: 'pw'
      });

      expect(instance.props.createWebhook).toHaveBeenCalledWith({
        name: 'my webhook',
        target: 'http://url.com',
        events: ['event'],
        auth_type: 'basic',
        auth_credentials: {
          username: 'user',
          password: 'pw'
        }
      });
      expect(instance.props.history.push).toHaveBeenCalledWith('/webhooks');
    });

    it('should set appropriate values for oauth2 webhook', async() => {
      const instance = wrapper.instance();
      await instance.createWebhook({
        name: 'my webhook',
        target: 'http://url.com',
        eventsRadio: 'select',
        message_event: ['event'],
        auth: 'oauth2',
        tokenURL: 'token',
        clientId: 'client',
        clientSecret: 'shhhh'
      });

      expect(instance.props.createWebhook).toHaveBeenCalledWith({
        name: 'my webhook',
        target: 'http://url.com',
        events: ['event'],
        auth_type: 'oauth2',
        auth_request_details: {
          url: 'token',
          body: {
            client_id: 'client',
            client_secret: 'shhhh'
          }
        }
      });
      expect(instance.props.history.push).toHaveBeenCalledWith('/webhooks');

    });
  });

  describe('componentDidMount tests', () => {
    it('should call getEventDocs if they don\'t exist on props', () => {
      const instance = wrapper.instance();
      instance.componentDidMount();
      expect(instance.props.getEventDocs).not.toHaveBeenCalled();
    });

    it('should not call getEventDocs if they exist on props', () => {
      wrapper.setProps({ eventDocs: null });
      const instance = wrapper.instance();
      instance.componentDidMount();
      expect(instance.props.getEventDocs).toHaveBeenCalled();
    });
  });
});
