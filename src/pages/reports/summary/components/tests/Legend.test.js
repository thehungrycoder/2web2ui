import React from 'react';
import { shallow } from 'enzyme';
import Legend from '../Legend';

describe('Component: Summary Chart Legend', () => {

  it('should render', () => {
    const props = {
      metrics: [
        { name: 'count_a', label: 'A', stroke: '#aaa' },
        { name: 'count_b', label: 'B', stroke: '#bbb' },
        { name: 'count_c', label: 'C', stroke: '#ccc' }
      ]
    };
    expect(shallow(<Legend {...props} />)).toMatchSnapshot();
  });

});
