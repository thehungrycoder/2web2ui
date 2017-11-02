import React from 'react';
import { shallow } from 'enzyme';
import ChunkLoading from '../ChunkLoading';

describe('LoadableLoading Component', () => {

  it('should return null if no props', () => {
    const wrapper = shallow(<ChunkLoading />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading if pastDelay is true', () => {
    const wrapper = shallow(<ChunkLoading pastDelay={true}/>);

    expect(wrapper).toMatchSnapshot();
  });
});
