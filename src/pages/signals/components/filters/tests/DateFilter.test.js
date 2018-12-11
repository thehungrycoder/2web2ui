import { shallow } from 'enzyme';
import React from 'react';
import { DateFilter } from '../DateFilter';

describe('DateFilter', () => {
  const subject = (props = {}) => shallow(<DateFilter {...props} />);

  it('renders a select', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('calls changeSignalOptions when select changes', () => {
    const changeSignalOptions = jest.fn();
    const wrapper = subject({ changeSignalOptions });

    wrapper.find('Select').simulate('change', { currentTarget: { value: '14days' }});

    expect(changeSignalOptions).toHaveBeenCalledWith({ relativeRange: '14days' });
  });
});
