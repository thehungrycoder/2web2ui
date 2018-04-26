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

  it('should push the username and track the initial event when username becomes available', () => {
    expect(analytics.setup).toHaveBeenCalledTimes(1);

    expect(wrapper.state('waitForUser')).toEqual(true);

    wrapper.setProps({ username: 'jojo' });
    expect(analytics.trackPageview).toHaveBeenCalledWith('/some/path?fun=times', 'Test Title', 'jojo');

    expect(wrapper.state('waitForUser')).toEqual(false);
  });

  it('should track a page view immediately if on a public route, and not again when the username becomes available', () => {
    findRouteByPath.default = jest.fn(() => ({ title: 'Test Public Title', public: true }));
    jest.clearAllMocks();
    wrapper = shallow(<GoogleTagManager {...props} />);
    expect(analytics.setup).toHaveBeenCalledTimes(1);
    expect(analytics.trackPageview).toHaveBeenCalledWith('/some/path?fun=times', 'Test Public Title', undefined);
  });

  it('should track a new page view when the location changes', () => {
    findRouteByPath.default = jest.fn(() => ({ title: 'New Title' }));
    wrapper.setProps({ username: 'fred', location: { pathname: '/new', search: '' }});
    expect(analytics.trackPageview).toHaveBeenCalledWith('/new', 'New Title', 'fred');
  });

  it('should not track a new page view when the location changes if we are still waiting for the username to load', () => {
    wrapper.setProps({ location: { pathname: '/new2_FINAL', search: '' }});
    expect(analytics.setup).toHaveBeenCalledTimes(1);
    expect(analytics.trackPageview).not.toHaveBeenCalled();
  });

  it('should use the pathname if no title is available', () => {
    findRouteByPath.default = jest.fn(() => ({}));
    wrapper.setProps({ username: 'jane', location: { pathname: '/no-title', search: '?cool=story' }});
    expect(analytics.trackPageview).toHaveBeenCalledWith('/no-title?cool=story','/no-title', 'jane');
  });
});
