import React from 'react';
import { shallow } from 'enzyme';
import DisplayDate from '../DisplayDate';

describe('DisplayDate Component', () => {

  Date.now = () => '2017-11-17T18:08:00.000+00:00';

  it('should render time ago ', () => {
    const props = {
      timestamp: '2017-11-17T15:08:00.000+00:00',
      formattedDate: 'YYYY/MM/DD HH:mm'
    };
    const wrapper = shallow(<DisplayDate {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render formattedDate', () => {
    const props = {
      timestamp: '2017-11-16T18:08:00.000+00:00',
      formattedDate: 'YYYY/MM/DD HH:mm'
    };
    const wrapper = shallow(<DisplayDate {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

});
