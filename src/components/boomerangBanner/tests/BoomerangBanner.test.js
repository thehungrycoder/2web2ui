import React from 'react';
import { shallow } from 'enzyme';
import * as herokuHelpers from 'src/helpers/heroku';

import { BoomerangBanner } from '../BoomerangBanner';

jest.mock('src/helpers/heroku');

describe('Boomerang Banner', () => {
  let wrapper;

  beforeEach(() => {
    herokuHelpers.loadHerokuToolbar = jest.fn();

    wrapper = shallow(<BoomerangBanner />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render when the bar initializes', () => {
    expect(herokuHelpers.loadHerokuToolbar).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });
});
