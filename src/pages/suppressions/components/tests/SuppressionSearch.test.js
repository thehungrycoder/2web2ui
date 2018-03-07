import { shallow } from 'enzyme';
import React from 'react';
import { SuppressionSearch } from '../SuppressionSearch';
import FilterDropdown from 'src/components/filterDropdown/FilterDropdown';

let props;
let wrapper;

beforeEach(() => {
  props = {
    onSubmit: jest.fn(),
    refreshSuppressionDateRange: jest.fn(),
    searchSuppressions: jest.fn(),
    updateSuppressionSearchOptions: jest.fn(),
    search: {
      dateOptions: {}
    },
    list: null
  };
  wrapper = shallow(<SuppressionSearch {...props} />);
});

describe('SuppressionSearch', () => {

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should refresh date range on mount using the default value of "day"', () => {
    expect(props.refreshSuppressionDateRange).toHaveBeenCalledWith({ relativeRange: 'day' });
  });

  it('should refresh date range on mount using the stored range, if present', () => {
    props.search.dateOptions = { relativeRange: 'hour' };
    wrapper = shallow(<SuppressionSearch {...props} />);
    expect(props.refreshSuppressionDateRange).toHaveBeenLastCalledWith({ relativeRange: 'hour' });
  });

  describe('componentDidUpdate', () => {
    it('reloads suppressions if search reference changes', () => {
      const search = { is: 'new!' };
      wrapper.setProps({ search });
      expect(props.searchSuppressions).toHaveBeenCalledWith(search);
    });
  });

  describe('search form changes', () => {

    let types;
    let sources;

    beforeEach(() => {
      types = { a: false, b: true, c: true, d: false };
      sources = { aa: true, bb: false, cc: false, dd: true };
    });

    it('should update types', () => {
      wrapper.find(FilterDropdown).at(0).simulate('close', types);
      expect(props.updateSuppressionSearchOptions).toHaveBeenCalledWith({ types: ['b', 'c']});
    });

    it('should update sources', () => {
      wrapper.find(FilterDropdown).at(1).simulate('close', sources);
      expect(props.updateSuppressionSearchOptions).toHaveBeenCalledWith({ sources: ['aa', 'dd']});
    });

  });

});
