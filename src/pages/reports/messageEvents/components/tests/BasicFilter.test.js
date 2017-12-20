import { shallow } from 'enzyme';
import React from 'react';

import { BasicFilter } from '../BasicFilter';

let props;

let wrapper;

beforeEach(() => {
  props = {
    onSubmit: jest.fn(() => Promise.resolve()),
    reportFilters: null
  };

  wrapper = shallow(<BasicFilter {...props} />);

});

describe('BasicFilter', () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('refresh calls onSubmit with correct params', () => {
    props.recipients = 'email@domain.com';
    const instance = wrapper.instance();
    instance.refresh();
    expect(props.onSubmit).toBeCalledWith({ recipients: '', reportFilters: null });
  });
});
