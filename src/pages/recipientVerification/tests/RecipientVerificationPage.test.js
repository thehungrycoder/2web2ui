import { shallow } from 'enzyme';
import React from 'react';
import { RecipientVerificationPage } from '../RecipientVerificationPage';

describe('Page: Recipient Email Verification', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<RecipientVerificationPage/>);
  });

  it('should render happy path', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
