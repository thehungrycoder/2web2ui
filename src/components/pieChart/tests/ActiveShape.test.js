import React from 'react';
import ActiveShape from '../async/ActiveShape';
import { shallow } from 'enzyme';

describe('ActiveShape: ', () => {
  it('should render', () => {
    const props = {
      cx: 1,
      cy: 2,
      fill: '#000',
      innerRadius: 3,
      outerRadius: 4,
      startAngle: 5,
      endAngle: 6,
      children: []
    };
    const wrapper = shallow(<ActiveShape {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
