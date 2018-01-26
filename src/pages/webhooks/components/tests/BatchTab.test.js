import { shallow } from 'enzyme';
import React from 'react';

import { BatchTab } from '../BatchTab';

describe('Webhook Component: Batch Status Tab', () => {
  const props = {
    getBatches: jest.fn(),
    id: 'my-id',
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

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<BatchTab {...props} />);
  });

  it('should render batch status tab with table data', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show button text as Refreshing while refreshing data', () => {
    wrapper.setState({ refreshing: true });
    wrapper.setProps({ batchesLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show empty message when no batches exist', () => {
    wrapper.setProps({ batches: []});
    expect(wrapper).toMatchSnapshot();
  });

  it('should show panel loading when batches are loading', () => {
    wrapper.setProps({ batchesLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call getBatches in mounting', () => {
    const instance = wrapper.instance();
    instance.componentDidMount();
    expect(instance.props.getBatches).toHaveBeenCalledWith('my-id');
  });

  it('should getBatches when refreshing', () => {
    const instance = wrapper.instance();
    const stateSpy = jest.spyOn(instance, 'setState');
    instance.refreshBatches();
    expect(instance.props.getBatches).toHaveBeenCalledWith('my-id');
    expect(stateSpy).toHaveBeenCalledWith({ refreshing: true });
  });

});
