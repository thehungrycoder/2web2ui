import React from 'react';
import { shallow } from 'enzyme';

import HerokuMessage from '../HerokuMessage';

describe('HerokuMessage View Component', () => {
  it('should render', () => {
    expect(shallow(<HerokuMessage />)).toMatchSnapshot();
  });
});
