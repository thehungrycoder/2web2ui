import { shallow } from 'enzyme';
import React from 'react';
import Calculation from '../Calculation';

describe('Signals View Calculation Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      onChange: jest.fn()
    };
    wrapper = shallow(<Calculation {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
