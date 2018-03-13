import React from 'react';
import { shallow } from 'enzyme';
import { ConditionSwitch, defaultCase } from '../ConditionSwitch';

describe('Component: ConditionSwitch', () => {

  // some dummy test components
  function A() {}
  function B() {}
  function C() {}
  function D() {}

  it('should render only the first item whose condition function returns truthy for', () => {
    const wrapper = shallow(
      <ConditionSwitch accessConditionState={{}} ready={true}>
        <A condition={() => false} />
        <B condition={() => true} />
        <C condition={() => true} />
      </ConditionSwitch>
    );
    expect(wrapper.text()).toEqual('<B />');
  });

  it('should render nothing when not ready', () => {
    const wrapper = shallow(
      <ConditionSwitch accessConditionState={{}} ready={false}>
        <A condition={() => false} />
        <B condition={() => true} />
        <C condition={() => true} />
      </ConditionSwitch>
    );
    expect(wrapper.text()).toEqual('');
  });

  it('should render the default case if everything before it returned false', () => {
    const wrapper = shallow(
      <ConditionSwitch accessConditionState={{}} ready={true}>
        <A condition={() => false} />
        <B condition={() => false} />
        <C condition={() => false} />
        <D condition={defaultCase} />
      </ConditionSwitch>
    );
    expect(wrapper.text()).toEqual('<D />');
  });

  it('should ignore components with no condition', () => {
    const wrapper = shallow(
      <ConditionSwitch accessConditionState={{}} ready={true}>
        <A />
        <B condition={() => false} />
        <C condition={() => true} />
        <D condition={defaultCase} />
      </ConditionSwitch>
    );
    expect(wrapper.text()).toEqual('<C />');
  });

});
