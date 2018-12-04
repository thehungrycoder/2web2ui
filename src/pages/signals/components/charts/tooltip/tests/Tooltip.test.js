import { shallow } from 'enzyme';
import React from 'react';
import Tooltip from '../Tooltip';

describe('Sparkline Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      date: new Date('2010-01-01T12:00:00.000Z'),
      children: 'test'
    };
    wrapper = shallow(<Tooltip {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly without date', () => {
    wrapper.setProps({ date: null });
    expect(wrapper).toMatchSnapshot();
  });
});
