import { shallow } from 'enzyme';
import React from 'react';
import { WithSpamTrapDetails } from '../SpamTrapDetailsContainer';
import _ from 'lodash';

describe('Signals Spam Trap Details Container', () => {
  let wrapper;
  let props;
  const Component = () => <div>test</div>;

  beforeEach(() => {
    props = {
      component: Component,
      details: {
        history: []
      },
      facet: 'sending_domain',
      facetId: 'test.com',
      filters: {
        relativeRange: '14days'
      },
      getSpamHits: jest.fn(),
      selected: 'testing-selected',
      subaccountId: '101'
    };

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

  it('should shorten chart gap if history is long', () => {
    wrapper.setProps({ details: { history: _.range(15).map((n) => n) }});
    expect(wrapper.prop('gap')).toEqual(0.1);
  });
});
