import React from 'react';
import DeleteModal from '../DeleteModal';
import { shallow } from 'enzyme';

describe('DeleteModal Component', () => {
  const props = {
    title: 'NoobNoob',
    text: 'Got Damn',
    handleToggle: () => {},
    handleDelete: () => {},
    onConfirm: () => {},
    onCancel: () => {}
  };

  /** TODO FIX the component and test
  //it('should render - no props', () => {
  //  const wrapper = shallow(<DeleteModal />);
  //
  //  expect(wrapper).toMatchSnapshot();
  //}); */

  it('should render open with props', () => {
    const wrapper = shallow(<DeleteModal open={true} {...props}/>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render closed with props', () => {
    const wrapper = shallow(<DeleteModal open={false} {...props}/>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should disable delete button', () => {
    const wrapper = shallow(<DeleteModal deleting {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
