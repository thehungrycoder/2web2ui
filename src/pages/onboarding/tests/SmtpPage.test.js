import { shallow } from 'enzyme';
import React from 'react';
import SmtpPage from '../SmtpPage';
import AutoKeyGenerator from '../components/AutoKeyGenerator';

describe('SmtpPage', () => {
  it('should be wrapped in key generator', () => {
    const wrapper = shallow(<SmtpPage />);
    expect(wrapper.find(AutoKeyGenerator)).toHaveLength(1);
  });

  it('should render', () => {
    const RenderProp = shallow(<SmtpPage />).first().props().render;
    const wrapper = shallow(<RenderProp apiKey='123456789' />);
    expect(wrapper).toMatchSnapshot();
  });
});
