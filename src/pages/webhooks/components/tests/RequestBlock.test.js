import React from 'react';
import { shallow } from 'enzyme';
import RequestBlock from '../RequestBlock';

describe('Webhooks RequestBlock Component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<RequestBlock testRequest='value' targetURL='www.phoenix.co' />);
    expect(wrapper).toMatchSnapshot();
  });
});
