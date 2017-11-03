import React from 'react';
import { BouncePage } from '../BouncePage';
import { shallow } from 'enzyme';

describe('BouncePage: ', () => {

  const props = {
    loading: false,
    aggregates: { countBounce: 1 },
    refresh: jest.fn()
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<BouncePage {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with no bounces', () => {
    wrapper.setProps({ aggregates: { countBounce: 0 }});
    expect(wrapper).toMatchSnapshot();
  });
});
