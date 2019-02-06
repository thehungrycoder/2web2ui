import { shallow } from 'enzyme';
import React from 'react';
import ChartHeader from '../ChartHeader';

describe('Signals ChartHeader Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      title: 'Foo',
      date: '2018-02-15'
    };
    wrapper = shallow(<ChartHeader {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders primaryArea correctly', () => {
    wrapper.setProps({ primaryArea: <div>react</div> });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders tooltip content correctly', () => {
    wrapper.setProps({ tooltipContent: 'tooltip content' });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders padding correctly', () => {
    wrapper.setProps({ padding: '0 0 1rem 0' });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders without date', () => {
    wrapper.setProps({ date: null });
    expect(wrapper).toMatchSnapshot();
  });
});
