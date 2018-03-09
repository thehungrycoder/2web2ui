import React from 'react';
import { shallow } from 'enzyme';
import * as herokuHelpers from 'src/helpers/heroku';

import { BoomerangBanner } from '../BoomerangBanner';

jest.mock('src/helpers/heroku');

describe('Boomerang Banner', () => {
  let wrapper;

  beforeEach(() => {
    herokuHelpers.barMe = jest.fn(() => true);

    wrapper = shallow(<BoomerangBanner />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render when the bar initializes', () => {
    expect(herokuHelpers.barMe).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when the bar doesn\'t initialize', () => {
    herokuHelpers.barMe = jest.fn(() => false);

    wrapper = shallow(<BoomerangBanner />);

    expect(herokuHelpers.barMe).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should only render div when bar is already in place', () => {
    // ensure that the only call to barMe was made during the beforeEach render
    expect(herokuHelpers.barMe).toHaveBeenCalledTimes(1);

    document.getElementById = jest.fn(() => true);
    wrapper = shallow(<BoomerangBanner />);

    expect(herokuHelpers.barMe).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });
});
