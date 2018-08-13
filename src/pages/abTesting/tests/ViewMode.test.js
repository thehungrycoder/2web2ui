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
        version: 5,
        name: 'my ab test 1',
        status: 'running',
        default_template: {
          template_id: 'ab-test-1'
        },
        updated_at: '2018-10-21T10:10:10.000Z'
      },
      location: {
        pathname: '/ab-testing/id-1/5',
        search: '?subaccount=101'
      },
      latest: 5,
      deleteAction: {
        content: 'delete test',
        onClick: jest.fn()
      },
      cancelAction: {
        content: 'cancel test',
        onClick: jest.fn()
      },
      showAlert: jest.fn(),
      updateDraft: jest.fn(() => Promise.resolve()),
      history: { push: jest.fn() }
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

  it('should not render reschedule action if not viewing latest', () => {
    wrapper.setProps({ test: { ...props.test, status: 'cancelled', version: 4 }});
    expect(wrapper.find('Page').prop('primaryAction')).toBe(null);
  });

  it('should toggle override modal', () => {
    expect(wrapper.instance().state.showOverrideModal).toEqual(false);
    wrapper.instance().toggleOverride();
    expect(wrapper.instance().state.showOverrideModal).toEqual(true);
  });

  it('should handle override', () => {
    wrapper.setProps({ 'test': { id: 'ab-test' }});
    return wrapper.instance().handleOverride().then(() => {
      expect(props.updateDraft).toHaveBeenCalledWith({}, { id: 'ab-test', subaccountId: '101' });
      expect(props.showAlert).toHaveBeenCalled();
      expect(props.history.push).toHaveBeenCalled();
    });
  });
});
