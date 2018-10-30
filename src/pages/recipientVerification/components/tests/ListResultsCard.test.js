import React from 'react';
import { shallow } from 'enzyme';
import ListResultsCard from '../ListResultsCard';

describe('ListResultsCard', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      complete: false,
      upload_timestamp: 1541092618,
      file: 'no file'
    };

    wrapper = shallow(<ListResultsCard {...props} />);
  });

  it('renders correctly when not completed', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when completed', () => {
    wrapper.setProps({ completed: true });
    expect(wrapper).toMatchSnapshot();
  });
});
