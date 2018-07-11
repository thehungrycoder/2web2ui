import React from 'react';
import { shallow } from 'enzyme';
import { EditTab } from '../EditTab';
import WebhookForm from '../WebhookForm';

describe('Webhooks EditTab', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      webhook: {
        id: 'webhook id',
        name: 'webhook name',
        subaccount: 101,
        target: 'phoenix.co',
        events: ['key1']
      },
      getWebhook: jest.fn(),
      getEventDocs: jest.fn(),
      updateWebhook: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      eventListing: [
        {
          key: 'event1',
          description: 'desc for event 1',
          display_name: 'Event 1'
        },
        {
          key: 'event2',
          description: 'desc for event 2',
          display_name: 'Event 2'
        },
        {
          key: 'event3',
          description: 'desc for event 3',
          display_name: 'Event 3'
        },
        {
          key: 'event4',
          description: 'desc for event 4',
          display_name: 'Event 4'
        }
      ]
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
    wrapper.setProps({ eventListing: []});
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().props.getEventDocs).toHaveBeenCalledTimes(1);
  });

  describe('on submit', () => {
    it('form submit event calls the on submit handler', async () => {
      const updateSpy = jest.spyOn(wrapper.instance(), 'update');
      await wrapper.find(WebhookForm).simulate('submit', {});
      expect(updateSpy).toHaveBeenCalled();
    });

    it('submits successfully with selected events', async () => {
      const values = { name: 'new name', target: 'new target', events: { event1: true, event2: false }};
      await wrapper.instance().update(values, props.webhook);

      expect(props.updateWebhook).toHaveBeenCalledWith(expect.objectContaining({
        name: 'new name',
        target: 'new target',
        events: ['event1']
      }));
      expect(props.showAlert).toHaveBeenCalledWith({ message: 'Update Successful', type: 'success' });
      expect(props.getWebhook).toHaveBeenCalledWith({ id: 'webhook id', subaccount: 101 });
    });
  });
});
