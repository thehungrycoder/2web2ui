import { shallow } from 'enzyme';
import React from 'react';
import ControlGroup from '../ControlGroup';

describe('Signals View ControlGroup Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      options: {
        foo: 'fOo',
        bar: <test>BaR</test>
      },
      initialSelected: 'bar',
      onChange: jest.fn()
    };
    wrapper = shallow(<ControlGroup {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('handles a select correctly', () => {
    wrapper.find('Button').first().simulate('click');
    expect(wrapper.find('Button').first()).toMatchSnapshot();
    expect(props.onChange).toHaveBeenCalledWith('foo');
  });

  it('does not call onChange if not provided a callback', () => {
    wrapper.setProps({ onChange: null });
    wrapper.find('Button').first().simulate('click');
    expect(props.onChange).not.toHaveBeenCalled();
  });

  it('does not set selected initially if not provided', () => {
    wrapper = shallow(<ControlGroup options={props.options} />);
    expect(wrapper).toMatchSnapshot();
  });
});
