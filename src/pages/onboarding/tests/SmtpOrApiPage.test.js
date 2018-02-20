import { shallow } from 'enzyme';
import React from 'react';
import SmtpOrApiPage from '../SmtpOrApiPage';

describe('SmtpOrApiPage', () => {
  it('should render', () => {
    const wrapper = shallow(<SmtpOrApiPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
