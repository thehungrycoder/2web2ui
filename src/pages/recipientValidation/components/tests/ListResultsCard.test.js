import React from 'react';
import { shallow } from 'enzyme';
import ListResultsCard from '../ListResultsCard';

describe('ListResultsCard', () => {
  const subject = (props) => shallow(<ListResultsCard {...props} />);

  it('renders correctly when not complete', () => {
    expect(subject({
      complete: false,
      uploaded: 1541092618
    })).toMatchSnapshot();
  });

  it('renders correctly when complete', () => {
    expect(subject({
      complete: true,
      uploaded: 1541092618,
      rejectedUrl: 'testfile.csv',
      status: 'SUCCESS'
    })).toMatchSnapshot();
  });

  it('renders correctly when batch job fails', () => {
    expect(subject({
      complete: false,
      uploaded: 1541092618,
      rejectedUrl: 'testfile.csv',
      status: 'ERROR'
    })).toMatchSnapshot();
  });

  it('renders correctly when loading and status is unknown', () => {
    expect(subject()).toMatchSnapshot();
  });
});
