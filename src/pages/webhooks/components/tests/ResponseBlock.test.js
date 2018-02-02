import React from 'react';
import { shallow } from 'enzyme';
import ResponseBlock from '../ResponseBlock';


describe('Webhooks ResponseBlock Component', () => {
  it('should render correctly with a response', () => {
    const wrapper = shallow(<ResponseBlock testSent testResponse={{ status: 200 }}/>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render if not sent', () => {
    const wrapper = shallow(<ResponseBlock testSent={false} />);
    expect(wrapper.html()).toEqual(null);
  });

  it('should not render if not succesfull', () => {
    const wrapper = shallow(<ResponseBlock testSent testResponse={{ status: 500 }} />);
    expect(wrapper.html()).toEqual(null);
  });
});
