import { shallow } from 'enzyme';
import React from 'react';
import { NameForm } from '../NameForm';

describe('Component: NameForm', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = {
      initialValues: {
        firstName: 'foo',
        lastName: 'bar'
      }
    };
    wrapper = shallow(<NameForm {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when updating', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });
});

