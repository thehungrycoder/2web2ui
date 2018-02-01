import { shallow } from 'enzyme';
import React from 'react';

import { BatchTab } from '../BatchTab';

describe('Webhook Component: Batch Status Tab', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      getBatches: jest.fn(() => Promise.resolve()),
      webhook: {
        id: 'webhook-id'
      },
      batches: [
        {
          formatted_time: 'so-formatted',
          batch_id: '243423423423',
          status: 'p',
          attempts: 1,
          response_code: 200
        },
        {
          formatted_time: 'so-formatted-2',
          batch_id: '996969545',
          status: 'f',
          attempts: 4,
          response_code: 500
        }
      ],
      batchesLoading: false
    };

    wrapper = shallow(<BatchTab {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render batch status tab with table data', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show button text as Refreshing while refreshing data', () => {
    wrapper.setProps({ batchesLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show empty message when no batches exist', () => {
    wrapper.setProps({ batches: []});
    expect(wrapper).toMatchSnapshot();
  });

  it('should call getBatches in mounting', () => {
    const instance = wrapper.instance();
    expect(instance.props.getBatches).toHaveBeenCalledWith({ id: instance.props.webhook.id, subaccount: undefined });
  });

  it('should getBatches when refreshing', () => {
    const instance = wrapper.instance();
    instance.refreshBatches();
    expect(instance.props.getBatches).toHaveBeenCalledWith({ id: instance.props.webhook.id, subaccount: undefined });
  });

  it('should getBatches with a subaccount', () => {
    wrapper.setProps({ webhook: { id: 'id-with-sub', subaccount: 101 }});
    const instance = wrapper.instance();
    instance.refreshBatches();
    expect(instance.props.getBatches).toHaveBeenCalledWith({
      id: instance.props.webhook.id,
      subaccount: instance.props.webhook.subaccount
    });
  });

});
