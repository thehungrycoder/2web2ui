import { shallow } from 'enzyme';
import React from 'react';
import { ApiPage } from '../ApiPage';

describe('ApiPage', () => {
  it('should render', () => {
    const props = {
      apiKey: '123456789',
      email: 'e@mail.co'
    };
    const wrapper = shallow(<ApiPage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
