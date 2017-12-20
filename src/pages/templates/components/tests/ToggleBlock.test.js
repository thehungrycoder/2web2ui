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

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
