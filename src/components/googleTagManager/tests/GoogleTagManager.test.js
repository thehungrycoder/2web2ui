import { shallow } from 'enzyme';
import React from 'react';
import { GoogleTagManager } from '../GoogleTagManager';
import * as findRouteByPath from 'src/helpers/findRouteByPath';
import * as analytics from 'src/helpers/analytics';

jest.mock('src/helpers/findRouteByPath');
jest.mock('src/helpers/analytics');

describe('Component: GoogleTagManager', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    findRouteByPath.default = jest.fn(() => ({ title: 'Test Title', public: false }));

    props = {
      id: 'GTM-XXXX',
      location: {
        pathname: '/some/path',
        search: '?fun=times'
      }
    };
    wrapper = shallow(<GoogleTagManager {...props} />);
  });

  it('should init analytics and track initial page view on mount', () => {
    expect(analytics.setup).toHaveBeenCalledTimes(1);
    expect(wrapper.state('dataLayerLoaded')).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should push account ID and username when it becomes available', () => {
    const username = 'jojo';
    const accountId = 9999999;
    expect(analytics.setup).toHaveBeenCalledTimes(1);
    wrapper.setProps({ username, accountId });
    expect(analytics.setVariable).toHaveBeenCalledWith('username', username);
    expect(analytics.setVariable).toHaveBeenCalledWith('accountid', accountId);
  });

  it('should track a new page view when the location changes', () => {
    findRouteByPath.default = jest.fn(() => ({ title: 'New Title' }));
    wrapper.setProps({ username: 'fred', location: { pathname: '/new', search: '' }});
    expect(analytics.trackPageview).toHaveBeenCalledWith({
      path: '/new', title: 'New Title'
    });
  });

  it('should use the pathname if no title is available', () => {
    findRouteByPath.default = jest.fn(() => ({}));
    wrapper.setProps({ location: { pathname: '/no-title', search: '?cool=story' }});
    expect(analytics.trackPageview).toHaveBeenCalledWith({
      path: '/no-title?cool=story',
      title: '/no-title'
    });
  });
});
