import React from 'react';
import { shallow } from 'enzyme';
import ImportSnippetLink from '../ImportSnippetLink';

describe('ImportSnippetLink', () => {
  const subject = (props = {}) => shallow(<ImportSnippetLink {...props} />);

  it('renders link and closed modal', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('opens modal', () => {
    const wrapper = subject();
    wrapper.find('Button').simulate('click');
    expect(wrapper.find('Modal').prop('open')).toEqual(true);
  });

  it('closes modal', () => {
    const wrapper = subject();
    wrapper.find('Button').simulate('click');
    wrapper.find('Modal').simulate('close');
    expect(wrapper.find('Modal').prop('open')).toEqual(false);
  });
});
