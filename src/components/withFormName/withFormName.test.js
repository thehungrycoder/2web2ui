import React from 'react';
import { mount } from 'enzyme';
import withFormName from '.';

jest.mock('redux-form', () => ({
  FormName: ({ children }) => children({ form: 'example-form-name' })
}));

describe('withFormName', () => {
  it('renders wrapped component with formName prop', () => {
    const WrappedComponent = () => null;
    const TestComponent = withFormName(WrappedComponent);
    const wrapper = mount(<TestComponent />);

    expect(wrapper.find('WrappedComponent').prop('formName')).toEqual('example-form-name');
  });
});
