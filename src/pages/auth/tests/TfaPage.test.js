import React from 'react';
import { shallow } from 'enzyme';

import { TfaPage } from '../TfaPage';
import RedirectAfterLogin from '../components/RedirectAfterLogin';
import RedirectBeforeLogin from '../components/RedirectBeforeLogin';

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
  expect(subject({ loggedIn: true }).find(RedirectAfterLogin)).toHaveLength(1);
});

it('should redirect if tfa disabled', () => {
  expect(subject({ tfaEnabled: false }).find(RedirectBeforeLogin)).toHaveLength(1);
});
