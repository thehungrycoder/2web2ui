import React from 'react';
import { shallow } from 'enzyme';

import { SearchPanel } from '../SearchPanel';

describe('Search Panel Component', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      toggleForm: jest.fn()
    };
    wrapper = shallow(<SearchPanel {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call toggleForm on button click', () => {
    wrapper.find('Button').simulate('click');
    expect(wrapper.instance().props.toggleForm).toHaveBeenCalled();
  });

});

