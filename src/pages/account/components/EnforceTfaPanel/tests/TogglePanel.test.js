import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import TogglePanel from '../TogglePanel';

describe('Component: TogglePanel', () => {
  const baseProps = {
    tfaRequired: false,
    toggleTfaRequired: () => {}
  };

  function subject(props) {
    return shallow(<TogglePanel {...baseProps} {...props} />);
  }

  cases('should render', ({ tfaRequired }) => {
    expect(subject({ tfaRequired })).toMatchSnapshot();
  }, [ { tfaRequired: true }, { tfaRequired: false } ]);

  it('should call back on toggle', () => {
    const toggleTfaRequired = jest.fn();
    const wrapper = subject({ toggleTfaRequired });
    wrapper.find('Toggle').simulate('change');
    expect(toggleTfaRequired).toHaveBeenCalledTimes(1);
  });
});
