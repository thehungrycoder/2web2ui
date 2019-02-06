import { shallow } from 'enzyme';
import React from 'react';
import TooltipMetric from '../TooltipMetric';

describe('Signals TooltipMetric Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      label: 'Foo',
      value: 101
    };
    wrapper = shallow(<TooltipMetric {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with color', () => {
    wrapper.setProps({ color: '#abc' });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with description', () => {
    wrapper.setProps({ description: 'lorem ipsum dolor' });
    expect(wrapper).toMatchSnapshot();
  });
});
