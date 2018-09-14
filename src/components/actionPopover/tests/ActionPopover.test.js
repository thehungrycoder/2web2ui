import React from 'react';
import { shallow } from 'enzyme';
import ActionPopover from '../ActionPopover';

describe('ActionPopover Component', () => {

  const actions = [
    { content: 'Edit', to: '/some/link' },
    { content: 'Delete', onClick: jest.fn() }
  ];

  it('should render with no props', () => {
    const wrapper = shallow(<ActionPopover />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with actions', () => {
    const wrapper = shallow(<ActionPopover actions={actions}/>);

    expect(wrapper).toMatchSnapshot();
  });
});
