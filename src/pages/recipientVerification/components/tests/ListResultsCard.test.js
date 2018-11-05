import React from 'react';
import { shallow } from 'enzyme';
import ListResultsCard from '../ListResultsCard';

describe('ListResultsCard', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      complete: false,
      uploaded: 1541092618,
      rejectedUrl: 'testfile.csv'
    };

    wrapper = shallow(<ListResultsCard {...props} />);
  });

  it('renders correctly when not complete', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when complete', () => {
    wrapper.setProps({ complete: true });
    expect(wrapper).toMatchSnapshot();
  });
});
