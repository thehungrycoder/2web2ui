import React from 'react';
import { shallow } from 'enzyme';
import { EditTab } from '../EditTab';
import WebhookForm from '../WebhookForm';

jest.mock('src/pages/webhooks/helpers/prepareWebhookUpdate');

describe('Webhooks EditTab', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      webhook: {
        id: 'webhook id',
        name: 'webhook name',
        subaccount: 101,
        target: 'phoenix.co',
        events: ['key1']
      },
      getWebhook: jest.fn(),
      getEventDocs: jest.fn(),
      updateWebhook: jest.fn(),
      showAlert: jest.fn(),
      eventDocs: {
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
      }
    };

    wrapper = shallow(<EditTab {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading', () => {
    wrapper.setProps({ eventsLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should get events if not loaded on mount', () => {
    wrapper.setProps({ eventDocs: null });
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().props.getEventDocs).toHaveBeenCalledTimes(1);
  });

  describe('on submit', () => {
    it('form submit event calls the right handler', async() => {
      wrapper.setProps({ updateWebhook: jest.fn(() => Promise.resolve()) });
      const spy = jest.spyOn(wrapper.instance(), 'handleSubmit');
      wrapper.find(WebhookForm).simulate('submit');
      expect(spy).toHaveBeenCalled();
      expect(wrapper.instance().props.updateWebhook).toHaveBeenCalled();
    });

    it('submits successfully', async() => {
      wrapper.setProps({ updateWebhook: jest.fn(() => Promise.resolve()) });
      const props = wrapper.instance().props;
      const values = { name: 'new name', target: 'new target' };
      await wrapper.instance().handleSubmit(values, props.webhook);

      expect(props.updateWebhook).toHaveBeenCalled();
      expect(props.showAlert).toHaveBeenCalledWith({ message: 'Update Successful', type: 'success' });
      expect(props.getWebhook).toHaveBeenCalledWith({ id: 'webhook id', subaccount: 101 });
    });
  });
});
