import { shallow } from 'enzyme';
import React from 'react';
import { StatusPanel } from '../StatusPanel';
import { Panel } from '@sparkpost/matchbox';

describe('Status Panel Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      test: {
        id: 'test_one',
        version: 4,
        status: 'running'
      },
      latest: 5,
      id: 'test_one',
      version: 4,
      subaccountId: 101
    };
    wrapper = shallow(<StatusPanel {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render subaccount tag if test is not assigned to subaccount', () => {
    wrapper.setProps({ subaccountId: 0 });
    expect(wrapper.find('SubaccountTag')).toHaveLength(0);
  });

  it('should not render version selector if latest version is 1', () => {
    wrapper.setProps({ latest: 1 });
    expect(wrapper.find(Panel.Section).prop('actions')).toEqual(null);
  });

  describe('version selector', () => {
    let versionSelector;

    beforeEach(() => {
      versionSelector = shallow(wrapper.find(Panel.Section).prop('actions')[0].content);
    });

    it('should render correctly', () => {
      expect(versionSelector).toMatchSnapshot();
    });
  });
});
