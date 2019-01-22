import { shallow } from 'enzyme';
import React from 'react';
import { EngagementRecencyPreview } from '../EngagementRecencyPreview';

describe('Signals EngagementRecencyPreview Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      facet: 'ip-pool',
      facetId: 'best-pool',
      loading: false,
      gap: 0.5,
      empty: false,
      data: [1,2,3],
      subaccountId: 101
    };
    wrapper = shallow(<EngagementRecencyPreview {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders loading correctly', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders empty correctly', () => {
    wrapper.setProps({ empty: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders error correctly', () => {
    wrapper.setProps({ error: { message: 'error message' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('gets y axis props', () => {
    const axisProps = wrapper.find('BarChart').prop('yAxisProps');
    expect(axisProps.tickFormatter(0.2468)).toEqual('25%');
  });
});
