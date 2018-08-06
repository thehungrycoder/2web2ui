import { shallow } from 'enzyme';
import React from 'react';
import { TestCollection } from '../TestCollection';

describe('TestCollection Component', () => {
  const props = {
    abTests: [
      {
        id: 'id-1',
        version: '1',
        name: 'my ab test 1',
        status: 'scheduled',
        default_template: {
          template_id: 'ab-test-1'
        },
        updated_at: '2018-10-21T10:10:10.000Z'
      },
      {
        id: 'id-2',
        version: '2',
        name: 'my ab test 2',
        status: 'running',
        default_template: {
          template_id: 'ab-test-2'
        },
        updated_at: '2018-10-22T10:10:10.000Z'
      },
      {
        id: 'id-3',
        version: '3',
        name: 'my ab test 3',
        status: 'completed',
        winning_template_id: 'ab-test-winner',
        default_template: {
          template_id: 'ab-test-3'
        },
        updated_at: '2018-10-23T10:10:10.000Z'
      }
    ],
    toggleCancel: jest.fn(),
    toggleDelete: jest.fn()
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<TestCollection {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render row data properly', () => {
    const row = wrapper.instance().getRowData(props.abTests[0]);
    expect(row).toMatchSnapshot();
  });
});
