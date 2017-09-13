import { shallow } from 'enzyme';
import React from 'react';

import { AuthPage } from '../AuthPage';
import { props } from './AuthPage.test';

it('matches snapshot', () => {
  const wrapper = shallow(<AuthPage {...props} />);

  expect(wrapper).toMatchSnapshot();
});
