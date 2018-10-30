import React from 'react';
import { shallow } from 'enzyme';
import { ListResults } from '../ListResults';

describe('ListResults', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      results: null,
      getLatest: jest.fn()
    };

    wrapper = shallow(<ListResults {...props} />);
  });

  it('gets latest results on mount', () => {
    expect(props.getLatest).toHaveBeenCalled();
  });

  it('renders correctly with no results', () => {
    expect(wrapper.html()).toBe(null);
  });

  // it('renders correctly with results', () => {
  //   expect(wrapper).toMatchSnapshot();
  // });

  // it('correctly start polling when a new list id is recieved', () => {
  // });
  //
  // it('correctly stops polling when results come back as completed', () => {
  // });
});
