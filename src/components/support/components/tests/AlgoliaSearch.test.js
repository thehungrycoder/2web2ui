import React from 'react';
import { shallow } from 'enzyme';

import { AlgoliaSearch } from '../AlgoliaSearch';

describe('Algolia Search component', () => {
  const defaultSearchText = 'default search';
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      defaultSearchText,
      refine: jest.fn()
    };
    wrapper = shallow(<AlgoliaSearch {...props} />);
  });

  it('should render with empty text field', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should refine search on mount with default search text', () => {
    expect(props.refine).toHaveBeenCalledWith(defaultSearchText);
  });

  it('should render text field with user entered search text', () => {
    wrapper.find('TextField').simulate('change', { currentTarget: { value: 'example search' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should refine search when search text changes', () => {
    const searchText = 'example search';
    wrapper.setState({ searchText });
    expect(props.refine).toHaveBeenCalledWith(searchText);
  });

  it('should refine search with default search text when blank search text is entered', () => {
    wrapper.setState({ searchText: '  ' });
    expect(props.refine).toHaveBeenCalledTimes(2);
    expect(props.refine).toHaveBeenCalledWith(defaultSearchText);
  });

  it('should refine search when default search text changes', () => {
    const nextDefaultSearchText = 'new search text';
    wrapper.setProps({ defaultSearchText: nextDefaultSearchText });
    expect(props.refine).toHaveBeenCalledWith(nextDefaultSearchText);
  });
});
