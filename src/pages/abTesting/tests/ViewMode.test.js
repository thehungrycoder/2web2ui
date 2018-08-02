import { shallow } from 'enzyme';
import React from 'react';
import { ViewMode } from '../ViewMode';

describe('Page: A/B Test View Mode', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      subaccountId: '101',
      test: {
        id: 'id-1',
        version: '1',
        name: 'my ab test 1',
        status: 'running',
        default_template: {
          template_id: 'ab-test-1'
        },
        updated_at: '2018-10-21T10:10:10.000Z'
      },
      deleteAction: {
        content: 'delete content',
        onClick: jest.fn()
      }
    };
    wrapper = shallow(<ViewMode {...props} />);

  });

  it('should render running status correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render completed status correctly', () => {
    wrapper.setProps({ test: { ...props.test, status: 'completed' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render cancelled status correctly', () => {
    wrapper.setProps({ test: { ...props.test, status: 'cancelled' }});
    expect(wrapper).toMatchSnapshot();
  });
});
