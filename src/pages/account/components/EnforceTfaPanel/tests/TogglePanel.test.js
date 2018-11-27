import React from 'react';
import { shallow } from 'enzyme';
import TogglePanel from '../TogglePanel';

describe('Component: TogglePanel', () => {
  const baseProps = {
    tfaRequired: false,
    toggleTfaRequired: () => {}
  };

  function subject(props) {
    return shallow(<TogglePanel {...baseProps} {...props} />);
  }

  it('should render', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('should reflect tfaRequired', () => {
    expect(subject({ tfaRequired: true }).find('Toggle').prop('checked')).toEqual(true);
  });

  it('should call back on toggle', () => {
    const toggleTfaRequired = jest.fn();
    const wrapper = subject({ toggleTfaRequired });
    wrapper.find('Toggle').simulate('change');
    expect(toggleTfaRequired).toHaveBeenCalledTimes(1);
  });

  it('should be disabled iff readOnly', () => {
    expect(subject({ readOnly: true }).find('Toggle').prop('disabled')).toEqual(true);
  });
});
