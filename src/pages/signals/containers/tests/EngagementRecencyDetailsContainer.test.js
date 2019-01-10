import { shallow } from 'enzyme';
import React from 'react';
import { WithEngagementRecencyDetails } from '../EngagementRecencyDetailsContainer';
import * as dateMock from 'src/helpers/date';
import _ from 'lodash';

jest.mock('src/helpers/date');

describe('Signals Engagement Recency Details Container', () => {
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
      getEngagementRecency: jest.fn(),
      subaccountId: '101'
    };

    dateMock.getDateTicks.mockImplementation(() => [1,2]);
    wrapper = shallow(<WithEngagementRecencyDetails {...props} />);
  });

  it('gets engagement recency on mount correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.getEngagementRecency).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      relativeRange: '14days',
      subaccount: '101'
    });
  });

  it('gets engagement recency when range is updated', () => {
    wrapper.setProps({ filters: { relativeRange: '30days' }});
    expect(props.getEngagementRecency).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      relativeRange: '30days',
      subaccount: '101'
    });
  });

  it('should not get engagement recency when range isnt updated', () => {
    jest.clearAllMocks();
    wrapper.setProps({ another: 'prop' });
    expect(props.getEngagementRecency).toHaveBeenCalledTimes(0);
  });

  it('should shorten chart gap if data is long', () => {
    wrapper.setProps({ details: { data: _.range(16).map((n) => n) }});
    expect(wrapper.prop('gap')).toEqual(0.2);
  });
});
