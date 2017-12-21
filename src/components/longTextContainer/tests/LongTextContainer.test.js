import React from 'react';
import LongTextContainer from '../LongTextContainer';
import { shallow } from 'enzyme';

describe('Long Text Container: ', () => {
  it('should render', () => {
    const wrapper = shallow(<LongTextContainer text={'foo'} />);
    expect(wrapper).toMatchSnapshot();
  });
});
