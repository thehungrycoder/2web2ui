import React from 'react';
import { shallow } from 'enzyme';
import LoadableLoading from '../LoadableLoading';

describe('LoadableLoading Component', () => {

  it('should return null if no props', () => {
    const wrapper = shallow(<LoadableLoading />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading if pastDelay is true', () => {
    const wrapper = shallow(<LoadableLoading pastDelay={true}/>);

    expect(wrapper).toMatchSnapshot();
  });
});
