import { shallow } from 'enzyme';
import React from 'react';

import SmtpDetails from '../SmtpDetails';

describe('Smtp component: Smtp Details', () => {
  it('should render page correctly with defaults', () => {
    const wrapper = shallow(<SmtpDetails />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render page correctly with an api key', () => {
    const wrapper = shallow(<SmtpDetails apiKey='123456' />);
    expect(wrapper).toMatchSnapshot();
  });

});
