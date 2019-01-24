import React from 'react';
import { shallow } from 'enzyme';
import FromEmailWrapper from '../FromEmailWrapper';

describe('FromEmailWrapper', () => {
  const subject = (props = {}) => shallow(
    <FromEmailWrapper
      input={{ onChange: jest.fn() }}
      meta={{}}
      label="Test Wrapper"
      {...props}
    />
  );

  it('renders input', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders input with an error message', () => {
    const wrapper = subject({
      meta: {
        active: false,
        error: 'Oh no!',
        touched: true
      }
    });

    expect(wrapper).toMatchSnapshot();
  });
});
