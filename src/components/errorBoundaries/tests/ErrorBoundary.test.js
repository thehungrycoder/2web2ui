import { shallow } from 'enzyme';
import React from 'react';
import ErrorBoundary from '../ErrorBoundary';

describe('Component: ErrorBoundary', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = {
      showAction: false,
      children: jest.fn()
    };
  });

  beforeEach(() => {
    wrapper = shallow(<ErrorBoundary {...props}><div>Children</div></ErrorBoundary>);
  });

  it('renders (children) correctly without error', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with error', () => {
    wrapper.setState({ hasError: true });
    expect(wrapper).toMatchSnapshot();
  });
});
