import React from 'react';
import { shallow } from 'enzyme';
import ExternalLink from '../ExternalLink';

describe('ExternalLink', () => {
  it('renders', () => {
    const wrapper = shallow(<ExternalLink to="http://example.com" />);
    expect(wrapper).toMatchSnapshot();
  });
});
