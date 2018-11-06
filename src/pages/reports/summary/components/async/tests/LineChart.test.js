import React from 'react';
import LineChart from '../LineChart';
import { shallow } from 'enzyme';


describe('LineChart: ', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {};

    wrapper = shallow(<LineChart {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
