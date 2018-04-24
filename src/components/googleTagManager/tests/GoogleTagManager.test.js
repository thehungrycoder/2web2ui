import { shallow } from 'enzyme';
import React from 'react';
import { GoogleTagManager } from '../GoogleTagManager';
import * as findRouteByPath from 'src/helpers/findRouteByPath';

jest.mock('src/helpers/findRouteByPath');

describe('Component: GoogleTagManager', () => {
  const timestamp = 1523978057120;

  let initialEvent;
  let wrapper;
  let props;

  Date = jest.fn(() => ({ // eslint-disable-line
    getTime: () => timestamp
  }));

  beforeEach(() => {
    findRouteByPath.default = jest.fn(() => ({ title: 'Test Title', public: false }));
    props = {
      id: 'GTM-XXXX',
      location: {
        pathname: '/some/path',
        search: '?fun=times'
      }
    };
    initialEvent = {
      event: 'gtm.js',
      'gtm.start': 1523978057120

    };
    wrapper = shallow(<GoogleTagManager {...props} />);
  });

  it('should init dataLayer and track initial page view on mount', () => {
    expect(window.dataLayer).toEqual([initialEvent]);
    expect(wrapper.state('dataLayerLoaded')).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should push the username and track the initial event when username becomes available', () => {
    expect(window.dataLayer).toEqual([initialEvent]);

    expect(wrapper.state('waitForUser')).toEqual(true);

    wrapper.setProps({ username: 'jojo' });
    expect(window.dataLayer).toEqual([initialEvent, {
      event: 'content-view',
      'content-name': '/some/path?fun=times',
      'content-title': 'Test Title',
      username: 'jojo'
    }
    ]);

    expect(wrapper.state('waitForUser')).toEqual(false);
  });

  it('should track a page view immediately if on a public route, and not again when the username becomes available', () => {
    findRouteByPath.default = jest.fn(() => ({ title: 'Test Public Title', public: true }));
    wrapper = shallow(<GoogleTagManager {...props} />);
    expect(window.dataLayer).toHaveLength(2);
    expect(window.dataLayer.pop()).toEqual({
      event: 'content-view',
      'content-name': '/some/path?fun=times',
      'content-title': 'Test Public Title',
      username: undefined
    });
  });

  it('should track a new page view when the location changes', () => {
    findRouteByPath.default = jest.fn(() => ({ title: 'New Title' }));
    wrapper.setProps({ username: 'fred', location: { pathname: '/new', search: '' }});
    expect(window.dataLayer.pop()).toEqual({
      event: 'content-view',
      'content-name': '/new',
      'content-title': 'New Title',
      username: 'fred'
    });
  });

  it('should not track a new page view when the location changes if we are still waiting for the username to load', () => {
    wrapper.setProps({ location: { pathname: '/new2_FINAL', search: '' }});
    expect(window.dataLayer).toEqual([initialEvent]);
  });

  it('should use the pathname if no title is available', () => {
    findRouteByPath.default = jest.fn(() => ({}));
    wrapper.setProps({ username: 'jane', location: { pathname: '/no-title', search: '?cool=story' }});
    expect(window.dataLayer.pop()).toEqual({
      event: 'content-view',
      'content-name': '/no-title?cool=story',
      'content-title': '/no-title',
      username: 'jane'
    });
  });

});
