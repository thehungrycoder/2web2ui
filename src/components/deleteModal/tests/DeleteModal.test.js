import React from 'react';
import DeleteModal from '../DeleteModal';

describe('DeleteModal Component', () => {
  const props = {
    title: 'NoobNoob',
    text: 'Got Damn',
    handleToggle: () => {},
    handleDelete: () => {}
  }

  it('should render - no props', () => {
    const wrapper = shallow(<DeleteModal />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render open with props', () => {
    const wrapper = shallow(<DeleteModal open={true} {...props}/>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render closed with props', () => {
    const wrapper = shallow(<DeleteModal open={false} {...props}/>);

    expect(wrapper).toMatchSnapshot();
  });
});
