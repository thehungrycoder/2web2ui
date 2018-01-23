import { shallow } from 'enzyme';
import React from 'react';

import ToggleBlock from '../ToggleBlock';

describe('ToggleBlock', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      input: {
        name: 'name'
      },
      meta: {},
      label: 'label',
      helpText: 'some help'
    };

    wrapper = shallow(<ToggleBlock {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render helptext if it is not provided', () => {
    wrapper.setProps({ helpText: null });
    expect(wrapper.find('p')).toHaveLength(0);
  });
});
