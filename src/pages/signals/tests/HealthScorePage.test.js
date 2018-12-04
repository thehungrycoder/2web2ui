import { shallow } from 'enzyme';
import React from 'react';
import { HealthScorePage } from '../HealthScorePage';

describe('Signals Health Score Page', () => {
  let wrapper;

  beforeEach(() => {
    const props = {};
    wrapper = shallow(<HealthScorePage {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
