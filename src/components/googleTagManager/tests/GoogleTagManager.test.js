import { shallow } from 'enzyme';
import React from 'react';
import { GoogleTagManager } from '../GoogleTagManager';
import * as findRouteByPath from 'src/helpers/findRouteByPath';

jest.mock('src/helpers/findRouteByPath');

describe('Component: GoogleTagManager', () => {

  let wrapper;
  let props;

  beforeEach(() => {
    findRouteByPath.default = jest.fn(() => ({ title: 'Test Title' }));
    props = {
      id: 'GTM-XXXX',
      location: {
        pathname: '/some/path',
        search: '?fun=times'
      }
    };
    wrapper = shallow(<GoogleTagManager {...props} />);
  });

  it('should init dataLayer and track initial page view on mount', () => {
    expect(window.dataLayer).toEqual([{
      event: 'content-view',
      'content-name': '/some/path?fun=times',
      'content-title': 'Test Title'
    }]);
    expect(wrapper.state('dataLayerLoaded')).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should push the username when it becomes available', () => {
    wrapper.setProps({ username: 'jojo' });
    expect(window.dataLayer.pop()).toEqual({ username: 'jojo' });
  });

  it('should track a new page view when the location changes', () => {
    findRouteByPath.default = jest.fn(() => ({ title: 'New Title' }));
    wrapper.setProps({ location: { pathname: '/new', search: '' }});
    expect(window.dataLayer.pop()).toEqual({
      event: 'content-view',
      'content-name': '/new',
      'content-title': 'New Title'
    });
  });

  it('should use the pathname if no title is available', () => {
    findRouteByPath.default = jest.fn(() => ({}));
    wrapper.setProps({ location: { pathname: '/no-title', search: '?cool=story' }});
    expect(window.dataLayer.pop()).toEqual({
      event: 'content-view',
      'content-name': '/no-title?cool=story',
      'content-title': '/no-title'
    });
  });

});
