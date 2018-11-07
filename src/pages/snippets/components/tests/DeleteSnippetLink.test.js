import React from 'react';
import { shallow } from 'enzyme';
import DeleteSnippetLink from '../DeleteSnippetLink';

describe('DeleteSnippetLink', () => {
  // pass-through to test the render prop
  const subject = ({ open, wasDeleted, ...props } = {}) => {
    const wrapper = shallow(
      <DeleteSnippetLink
        children="Delete"
        id="test-snippet"
        subaccountId="123"
        to="/bogus"
        {...props}
      />
    );
    const RenderProp = wrapper.prop('children');

    return shallow(<RenderProp open={open} wasDeleted={wasDeleted} />);
  };

  it('renders unstyled link', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('redirects with an alert when deleted', () => {
    const wrapper = subject({ wasDeleted: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('opens modal when link is clicked', () => {
    const open = jest.fn();
    const wrapper = subject({ open });

    wrapper.simulate('click');
    expect(open).toHaveBeenCalledWith({ id: 'test-snippet', subaccountId: '123' });
  });
});
