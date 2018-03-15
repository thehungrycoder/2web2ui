import { shallow } from 'enzyme';
import React from 'react';

import { TestTab } from '../TestTab';

describe('Webhook Component: Test Tab', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      getEventSamples: jest.fn(),
      samples: [{ msys: 'sample' }],
      testLoading: false,
      testResponse: 'response',
      testWebhook: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      webhook: {
        id: 'webhook-id',
        subaccount: 101,
        auth_token: '123',
        target: 'phoenix.co'
      }
    };

    // TestTab.buildTestRequest = jest.fn().mockImplementation(() => [{ test: 'mock' }]);
    wrapper = shallow(<TestTab {...props} />);
    // wrapper.instance().buildTestRequest = jest.fn().mockImplementation(() => { request: 'mock' });
    // wrapper.unmount();

  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders loading``', () => {
    wrapper.setProps({ samplesLoading: true });
    expect(wrapper.find('PanelLoading')).toHaveLength(1);
  });

  describe('submit', () => {
    it('test button calls the right method', () => {
      wrapper.find('Button').simulate('click');
      expect(wrapper.instance().props.testWebhook).toHaveBeenCalled();
    });

    it('submits correctly', async() => {
      const instance = wrapper.instance();
      await instance.testWebhook();
      expect(instance.props.testWebhook.mock.calls).toMatchSnapshot();
      expect(instance.props.testWebhook).toHaveBeenCalled();
      expect(instance.props.showAlert).toHaveBeenCalledWith({ message: 'The test was successful!', type: 'success' });
    });
  });
});
