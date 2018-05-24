import React from 'react';
import { shallow } from 'enzyme';

import { AlgoliaSearch } from '../AlgoliaSearch';

describe('Algolia Search component', () => {
  const defaultRefinement = 'default refinement';
  const inputText = 'example text';
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      defaultRefinement,
      refine: jest.fn()
    };
    wrapper = shallow(<AlgoliaSearch {...props} />);
  });

  it('should render with empty text field', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with input text', () => {
    wrapper.setState({ text: inputText });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render and refine with input text', () => {
    wrapper.find('TextField').simulate('change', { currentTarget: { value: inputText }});
    expect(props.refine).toHaveBeenCalledWith(inputText);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with input text and refine with default refinement', () => {
    wrapper.find('TextField').simulate('change', { currentTarget: { value: ' ' }});
    expect(props.refine).toHaveBeenCalledWith(defaultRefinement);
    expect(wrapper).toMatchSnapshot();
  });
});
