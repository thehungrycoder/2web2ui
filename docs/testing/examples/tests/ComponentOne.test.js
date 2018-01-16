import React from 'react';
import { shallow } from 'enzyme';
import ComponentOne from '../ComponentOne';
import ComponentTwo from '../ComponentTwo';

describe('ComponentOne', () => {

  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      fetchData: jest.fn(),
      submit: jest.fn(),
      visible: true
    };
    wrapper = shallow(<ComponentOne {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when not visible', () => {
    wrapper.setProps({ visible: false });
    expect(wrapper).toMatchSnapshot();
  });

  /**
   * componentDidMount will be called as part of
   * the shallow render or mount call, so you can
   * expect on things that should have happened there
   */
  it('should fetch data on mount', () => {
    expect(props.fetchData).toHaveBeenCalledTimes(1);
  });

  /**
   * Use wrapper.setProps() and wrapper.state() to check
   * state changes based on prop changes that happen in
   * cWRP, cWU or cDU etc. No need to snapshot if little
   * to nothing changes in rendered output.
   */
  it('should update state if submitted prop changes and is boolean', () => {
    expect(wrapper.state('submitted')).toEqual(false);

    // no change on other prop changes
    wrapper.setProps({ random: 123, cool: 'story' });
    expect(wrapper.state('submitted')).toEqual(false);

    // no change if value isn't boolean
    wrapper.setProps({ submitted: 'ok' });
    expect(wrapper.state('submitted')).toEqual(false);

    // change
    wrapper.setProps({ submitted: true });
    expect(wrapper.state('submitted')).toEqual(true);

    // change
    wrapper.setProps({ submitted: false });
    expect(wrapper.state('submitted')).toEqual(false);
  });

  /**
   * Find element by ID, then simulate with a custom
   * event. Verify state changes directly. If rendered
   * output changes, you can also snapshot new output.
   */
  it('should change the message on click', () => {
    const button = wrapper.find('#change-message');
    const e = {
      preventDefault: jest.fn(),
      target: { value: 'A very new message' }
    };

    button.simulate('click', e);

    expect(wrapper.state('message')).toEqual('A very new message');
    expect(e.preventDefault).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });

  /**
   * Find an element inside the wrapper by using
   * a reference to the class itself, imported
   *
   * Check state changes directly after simulation
   */
  it('should set the submitted flag', () => {
    const c2 = wrapper.find(ComponentTwo);

    c2.simulate('submit');

    expect(wrapper.state('submitted')).toEqual(true);
  });

  /**
   * Use an instance method when we expect the method
   * is being called with arguments from a child component
   *
   * Simulate won't work here because it would only give
   * the function the event, but this method will be called
   * directly by a child component with custom values
   */
  it('should submit values', () => {
    const instance = wrapper.instance();
    const values = {};

    instance.handleSubmit(values);

    expect(props.submit).toHaveBeenCalledWith(values);
  });

});
