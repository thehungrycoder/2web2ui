import React from 'react';
import { shallow } from 'enzyme';
import { ConditionSwitch, defaultCase, Case } from '../ConditionSwitch';

describe('Component: ConditionSwitch', () => {

  it('should render only the first item whose condition function returns truthy for', () => {
    const wrapper = shallow(
      <ConditionSwitch accessConditionState={{}} ready={true}>
        <Case condition={() => false}>A</Case>
        <Case condition={() => true}>B</Case>
        <Case condition={() => true}>C</Case>
      </ConditionSwitch>
    );
    expect(wrapper.html()).toEqual('B');
  });

  it('should render nothing when not ready', () => {
    const wrapper = shallow(
      <ConditionSwitch accessConditionState={{}} ready={false}>
        <Case condition={() => false}>A</Case>
        <Case condition={() => true}>B</Case>
        <Case condition={() => true}>C</Case>
      </ConditionSwitch>
    );
    expect(wrapper.text()).toEqual('');
  });

  it('should render the default case if everything before it returned false', () => {
    const wrapper = shallow(
      <ConditionSwitch accessConditionState={{}} ready={true}>
        <Case condition={() => false}>A</Case>
        <Case condition={() => false}>B</Case>
        <Case condition={() => false}>C</Case>
        <Case condition={defaultCase}>D</Case>
      </ConditionSwitch>
    );
    expect(wrapper.html()).toEqual('D');
  });

  it('should ignore components with no condition', () => {
    const wrapper = shallow(
      <ConditionSwitch accessConditionState={{}} ready={true}>
        <Case>A</Case>
        <Case condition={() => false}>B</Case>
        <Case condition={() => true}>C</Case>
        <Case condition={defaultCase}>D</Case>
      </ConditionSwitch>
    );
    expect(wrapper.html()).toEqual('C');
  });

  it('should work with custom components', () => {
    function Custom() {}

    const wrapper = shallow(
      <ConditionSwitch accessConditionState={{}} ready={true}>
        <Case condition={() => false}>A</Case>
        <Custom condition={() => true}/>
      </ConditionSwitch>
    );
    expect(wrapper.text()).toEqual('<Custom />');
  });

});
