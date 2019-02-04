import { shallow } from 'enzyme';
import React from 'react';
import { ListPageContainer } from '../ListPageContainer';

describe('Alerts List Page Container', () => {
  let wrapper;
  let props;
  const Component = () => <div>test</div>;

  beforeEach(() => {
    props = {
      component: Component,
      listAlerts: jest.fn()
    };

    wrapper = shallow(<ListPageContainer {...props} />);
  });

  it('gets alerts list on mount correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.listAlerts).toHaveBeenCalled();
  });
});
