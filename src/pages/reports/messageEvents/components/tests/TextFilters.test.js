import React from 'react';
import { shallow } from 'enzyme';
import TextFilters from '../TextFilters';

jest.mock('../searchConfig', () => ({
  TEXT_FILTERS: [
    { key: 'coffee', label: 'Elixir Of Life' },
    { key: 'context', label: 'Relevence' }
  ]
}));

describe('TextFilters', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      filterValues: {},
      onChange: jest.fn()
    };
    wrapper = shallow(<TextFilters {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should populate fields', () => {
    props.filterValues.coffee = 'espresso';
    wrapper = shallow(<TextFilters {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should fire onChange', () => {
    wrapper.find('TextField').first().prop('onChange')();
    expect(props.onChange).toHaveBeenCalled();
  });
});
