import React from 'react';
import Empty from '../Empty';
import { shallow } from 'enzyme';

describe('Empty: ', () => {
  it('should render', () => {
    const wrapper = shallow(<Empty title={'Empty Title'} message={'nothing here to see'} />);
    expect(wrapper).toMatchSnapshot();
  });
});
