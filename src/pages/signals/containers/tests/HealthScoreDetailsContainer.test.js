import { shallow } from 'enzyme';
import React from 'react';
import { WithHealthScoreDetails } from '../HealthScoreDetailsContainer';
import * as dateMock from 'src/helpers/date';
import _ from 'lodash';

jest.mock('src/helpers/date');

describe('Signals Health Score Details Container', () => {
  let wrapper;
  let props;
  const Component = () => <div>test</div>;

  beforeEach(() => {
    props = {
      component: Component,
      details: {
        data: []
      },
      facet: 'sending_domain',
      facetId: 'test.com',
      filters: {
        relativeRange: '14days'
      },
      getSpamHits: jest.fn(),
      getHealthScore: jest.fn(),
      subaccountId: '101'
    };

    dateMock.getDateTicks.mockImplementation(() => [1,2]);
    wrapper = shallow(<WithHealthScoreDetails {...props} />);
  });

  it('gets health score and spam hits on mount correctly', () => {
    expect(wrapper).toMatchSnapshot();
    const options = {
      facet: 'sending_domain',
      filter: 'test.com',
      relativeRange: '14days',
      subaccount: '101'
    };
    expect(props.getSpamHits).toHaveBeenCalledWith(options);
    expect(props.getHealthScore).toHaveBeenCalledWith(options);
  });

  it('gets health score and spam hits when range is updated', () => {
    const options = {
      facet: 'sending_domain',
      filter: 'test.com',
      relativeRange: '30days',
      subaccount: '101'
    };
    wrapper.setProps({ filters: { relativeRange: '30days' }});
    expect(props.getSpamHits).toHaveBeenCalledWith(options);
    expect(props.getHealthScore).toHaveBeenCalledWith(options);
  });

  it('should not get health score and spam hits when range isnt updated', () => {
    jest.clearAllMocks();
    wrapper.setProps({ another: 'prop' });
    expect(props.getSpamHits).toHaveBeenCalledTimes(0);
    expect(props.getHealthScore).toHaveBeenCalledTimes(0);
  });

  it('should shorten chart gap if data is long', () => {
    wrapper.setProps({ details: { data: _.range(16).map((n) => n) }});
    expect(wrapper.prop('gap')).toEqual(0.2);
  });
});
