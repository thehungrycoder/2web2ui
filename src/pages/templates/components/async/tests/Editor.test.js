import { shallow } from 'enzyme';
import React from 'react';

import Editor from '../Editor';

describe('Editor', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      readOnly: false
    };

    wrapper = shallow(<Editor {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().selectedTab).toBe(0);
  });

  it('should select tabs', () => {
    wrapper.find('Tabs').props().tabs[1].onClick();
    expect(wrapper.state().selectedTab).toBe(1);
  });

  it('should set field read only correctly', () => {
    wrapper.setProps({ readOnly: true });
    expect(wrapper.find('Field').props().readOnly).toBe(true);

    // 'Test Data' is always editable
    wrapper.instance().handleTab(2);
    wrapper.update();
    expect(wrapper.find('Field').props().readOnly).toBe(false);
  });

  it('should set syntax validation correctly', () => {
    wrapper.instance().handleTab(1);
    wrapper.update();
    expect(wrapper.find('Field').props().syntaxValidation).toBe(false);

    wrapper.instance().handleTab(2);
    wrapper.update();
    expect(wrapper.find('Field').props().syntaxValidation).toBe(true);
  });
});
