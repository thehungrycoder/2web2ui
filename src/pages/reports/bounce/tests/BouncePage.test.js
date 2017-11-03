import React from 'react';
import { BouncePage } from '../BouncePage';
import { shallow } from 'enzyme';

jest.mock('src/helpers/reports');

Date.now = jest.fn(() => 1487076708000);

describe('BouncePage: ', () => {

  const props = {
    loading: false,
    aggregates: { countBounce: 1 },
    refresh: jest.fn((a) => Promise.resolve()),
    refreshTypeaheadCache: jest.fn((a) => Promise.resolve()),
    location: {
      search: {}
    },
    history: {
      replace: jest.fn()
    }
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<BouncePage {...props} />);

  });

  it('should render', () => {
    const parseSpy = jest.spyOn(wrapper.instance(), 'parseSearch');
    wrapper.instance().componentDidMount();
    expect(props.refresh).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalled();
    expect(props.refreshTypeaheadCache).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with no bounces', () => {
    wrapper.setProps({ aggregates: { countBounce: 0 }});
    expect(wrapper).toMatchSnapshot();
  });
});
