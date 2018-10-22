/* eslint-disable no-unused-vars, no-console */

import raf from './tempPolyfills';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16.3';
import toJson from 'enzyme-to-json';
import * as matchers from './matchers';

// Provides enzyme assertions.
// See https://github.com/blainekasten/enzyme-matchers#assertions
import 'jest-enzyme';

expect.extend(matchers); // register custom matchers

Enzyme.configure({ adapter: new Adapter() });

// Fail tests on any warning
console.error = (message) => {
  throw new Error(message);
};

// mock out a file that uses require.context under the hood
jest.mock('src/components/notifications/staticMarkdownNotifications', () => [
  {
    component: function() {},
    meta: { title: 'Some notification', type: 'info' }
  },
  {
    component: function() {},
    meta: { type: 'notice' }
  }
]);

beforeEach(() => {
  // Verifies that at least one assertion is called during a test
  // See https://facebook.github.io/jest/docs/en/expect.html#expecthasassertions
  expect.hasAssertions();
});

// Mock moment to set a default timezone
jest.mock('moment', () => {
  jest.unmock('moment'); // must unmock, so moment-timezone can require
  const momentTimezone = require.requireActual('moment-timezone');
  momentTimezone.tz.setDefault('America/New_York');
  return momentTimezone;
});

Object.defineProperty(global.navigator, 'userAgent', { value: 'node.js', configurable: true });
Object.defineProperty(global.navigator, 'language', { value: 'en-US', configurable: true });

// Show a stack track for unhandled rejections to help
// track them down.
process.on('unhandledRejection', (reason) => {
	console.log(reason)
});