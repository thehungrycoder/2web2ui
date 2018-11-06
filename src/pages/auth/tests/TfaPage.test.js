import React from 'react';
import { shallow } from 'enzyme';

import { TfaPage } from '../TfaPage';

const baseProps = {
  loggedIn: false,
  tfaEnabled: true
};

function subject(props) {
  return shallow(<TfaPage {...baseProps} {...props} />);
}

it('should render', () => {
  expect(subject()).toMatchSnapshot();
});

it('should redirect after login', () => {
  expect(subject({ loggedIn: true })).toMatchSnapshot();
});

it('should redirect if tfa disnabled', () => {
  expect(subject({ tfaEnabled: false })).toMatchSnapshot();
});
