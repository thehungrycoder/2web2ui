import React from 'react';
import { shallow } from 'enzyme';

import { AlgoliaSearch } from '../AlgoliaSearch';

describe('Algolia Search component', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = {
      currentRefinement: 'my text',
      refine: jest.fn()
    };

    wrapper = shallow(<AlgoliaSearch {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call refine on change', () => {
    wrapper.find('TextField').simulate('change', { currentTarget: { value: 'foo' }});
    expect(props.refine).toHaveBeenCalledWith('foo');
  });
});
