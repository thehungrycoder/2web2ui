import { shallow } from 'enzyme';
import React from 'react';
import { SmtpPage } from '../SmtpPage';

describe('SmtpPage', () => {
  it('should render function correctly', () => {
    const wrapper = shallow(<SmtpPage apiKey='123456789' />);
    expect(wrapper).toMatchSnapshot();
  });
});
