import React from 'react';
import { shallow } from 'enzyme';

import NoIssues from '../NoIssues';

describe('NoIssues View Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      onCancel: jest.fn()
    };
    wrapper = shallow(<NoIssues {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should cancel', () => {
    wrapper.find('Button').simulate('click');
    expect(props.onCancel).toHaveBeenCalled();
  });
});
