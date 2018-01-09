import React from 'react';
import { shallow } from 'enzyme';
import { Filters } from '../Filters';
import { Tag } from '@sparkpost/matchbox';
import Typeahead from '../Typeahead';

describe('Component: Report filters', () => {

  let wrapper;
  let testProps;

  beforeEach(() => {
    testProps = {
      refresh: jest.fn(),
      addFilter: jest.fn(),
      removeFilter: jest.fn(),
      typeaheadCache: [],
      filters: [],
      onShare: jest.fn()
    };
    wrapper = shallow(<Filters {...testProps} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('with active tags', () => {

    beforeEach(() => {
      wrapper.setProps({
        filters: [
          { type: 'A', value: 'aaa' },
          { type: 'B', value: 'bbb' },
          { type: 'C', value: 'ccc' }
        ]
      });
    });

    it('should render', () => {
      const tags = wrapper.find(Tag);
      expect(tags).toHaveLength(3);
      expect(wrapper).toMatchSnapshot();
    });

    it('should remove a tag by index', () => {
      const tags = wrapper.find(Tag);
      tags.first().simulate('remove');
      expect(testProps.removeFilter).toHaveBeenCalledWith(0);
      expect(testProps.refresh).toHaveBeenCalledTimes(1);
    });
  });

  it('should select a typeahead item', () => {
    const typeahead = wrapper.find(Typeahead);
    const item = {};
    typeahead.simulate('select', item);
    expect(testProps.addFilter).toHaveBeenCalledWith(item);
    expect(testProps.refresh).toHaveBeenCalledTimes(1);
  });

});
