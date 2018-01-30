import { shallow } from 'enzyme';
import React from 'react';

import { SendingDomainSection } from '../SendingDomainSection';

describe('Component: SendingDomainSection', () => {

  it('should render sending domain section', () => {
    const props = {
      title: 'Title',
      children: ['Bill', 'Brasky']
    };
    const wrapper = shallow(<SendingDomainSection {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

});
