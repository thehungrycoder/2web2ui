import { shallow } from 'enzyme';
import React from 'react';
import { WithSpamTrapDetails } from '../SpamTrapDetailsContainer';
import * as dateMock from 'src/helpers/date';
import _ from 'lodash';

jest.mock('src/helpers/date');

describe('Signals Spam Trap Details Container', () => {
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
      subaccountId: '101'
    };

    dateMock.getDateTicks.mockImplementation(() => [1,2]);
    wrapper = shallow(<WithSpamTrapDetails {...props} />);
  });

  it('gets spam hits on mount correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.getSpamHits).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      relativeRange: '14days',
      subaccount: '101'
    });
  });

  it('gets spam hits when range is updated', () => {
    wrapper.setProps({ filters: { relativeRange: '30days' }});
    expect(props.getSpamHits).toHaveBeenCalledWith({
      facet: 'sending_domain',
      filter: 'test.com',
      relativeRange: '30days',
      subaccount: '101'
    });
  });

  it('should not gets spam hits when range isnt updated', () => {
    jest.clearAllMocks();
    wrapper.setProps({ another: 'prop' });
    expect(props.getSpamHits).toHaveBeenCalledTimes(0);
  });

  it('should shorten chart gap if data is long', () => {
    wrapper.setProps({ details: { data: _.range(16).map((n) => n) }});
    expect(wrapper.prop('gap')).toEqual(0.2);
  });
});
