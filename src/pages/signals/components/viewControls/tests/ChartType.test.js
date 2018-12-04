import { shallow } from 'enzyme';
import React from 'react';
import ChartType from '../ChartType';

describe('Signals View ChartType Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      onChange: jest.fn()
    };
    wrapper = shallow(<ChartType {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
