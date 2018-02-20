import { shallow } from 'enzyme';
import React from 'react';
import ApiPage from '../ApiPage';
import AutoKeyGenerator from '../components/AutoKeyGenerator';

describe('ApiPage', () => {
  it('should be wrapped in key generator', () => {
    const wrapper = shallow(<ApiPage />);
    expect(wrapper.find(AutoKeyGenerator)).toHaveLength(1);
  });

  it('should render', () => {
    const props = {
      apiKey: '123456789',
      email: 'e@mail.co'
    };
    const RenderProp = shallow(<ApiPage />).first().props().render;
    const wrapper = shallow(<RenderProp {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
