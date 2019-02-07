import { shallow } from 'enzyme';
import React from 'react';
import Tooltip from '../Tooltip';

describe('Signals Tooltip Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      payload: [{
        value: 1,
        payload: {
          value: 1,
          date: new Date('2010-01-01T12:00:00.000Z')
        }
      }]
    };
    wrapper = shallow(<Tooltip {...props}/>);
  });

  it('renders correctly with default children', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly without date', () => {
    wrapper.setProps({ payload: [{ payload: { value: 1 }}]});
    expect(wrapper).toMatchSnapshot();
  });

  it('renders children correctly', () => {
    wrapper.setProps({ children: () => 'test' });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with a custom width correctly', () => {
    wrapper.setProps({ width: '1200px' });
    expect(wrapper).toMatchSnapshot();
  });
});
