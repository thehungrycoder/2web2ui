import React from 'react';
import { shallow } from 'enzyme';
import { CreateForm } from '../CreateForm';

describe('Component: Tracking Domains Create Form', () => {

  it('should render correctly when submitting is true', () => {
    const wrapper = shallow(<CreateForm submitting={true} handleSubmit={jest.fn()} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when submitting is false', () => {
    const wrapper = shallow(<CreateForm submitting={false} handleSubmit={jest.fn()} />);
    expect(wrapper).toMatchSnapshot();
  });

});
