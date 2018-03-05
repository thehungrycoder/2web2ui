import React from 'react';
import { shallow } from 'enzyme';

import { CreatePage } from '../CreatePage';

describe('CreatePage tests', () => {
  let wrapper;
  let instance;
  let props;

  beforeEach(() => {
    props = {
      resetErrors: jest.fn(),
      persistError: false,
      parseError: false
    };
    wrapper = shallow(<CreatePage {...props} />);
    instance = wrapper.instance();
  });

  it('should render UploadTab', () => {
    wrapper.setState({ selectedTab: 1 });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render AddTab', () => {
    wrapper.setState({ selectedTab: 0 });
    expect(wrapper).toMatchSnapshot();
  });

  it('should reset errors when changing tabs', () => {
    instance.handleTabs(1);
    expect(instance.props.resetErrors).toHaveBeenCalled();
  });

  it('should display the error banner on parse error', () => {
    wrapper.setProps({ parseError: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should display the error banner on persist error', () => {
    wrapper.setProps({ persistError: true });
    expect(wrapper).toMatchSnapshot();
  });
});

