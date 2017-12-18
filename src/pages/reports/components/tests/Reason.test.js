import React from 'react';
import ReasonCell from '../ReasonCell';
import { shallow } from 'enzyme';

describe('Reason Cell: ', () => {
  it('should render', () => {
    const wrapper = shallow(<ReasonCell reason={'foo'} />);
    expect(wrapper).toMatchSnapshot();
  });
});
