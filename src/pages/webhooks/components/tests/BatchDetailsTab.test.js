import { shallow } from 'enzyme';
import React from 'react';

import { BatchDetailsTab } from '../BatchDetailsTab';

describe('Webhook Component: Batch Status Tab', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      getBatches: jest.fn(() => Promise.resolve()),
      webhook: {
        id: 'webhook-id',
        subaccount: 101
      },
      batchId: 'batch_1',
      batches: [
        {
          formatted_time: 'so-formatted',
          batch_id: 'batch_1',
          status: 'Success',
          attempts: 2,
          response_code: 200
        },
        {
          formatted_time: 'so-formatted-2',
          batch_id: 'batch_1',
          status: 'f',
          attempts: 1,
          response_code: 500
        }
      ],
      loading: false,
      firstBatch: {
        formatted_time: 'so-formatted',
        batch_id: '243423423423',
        status: 'Success',
        attempts: 1,
        response_code: 200
      }
    };

    wrapper = shallow(<BatchDetailsTab {...props} />);
  });

  it('should render batch details', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should get batches on mount', () => {
    expect(props.getBatches.mock.calls).toMatchSnapshot();
  });

  it('should handle loading state', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });
});
