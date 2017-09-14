import React from 'react';
import SparkPost from '../SparkPost';
import cases from 'jest-in-case';
import { render } from 'enzyme';

describe('SparkPost Component', () => {
  // type doesn't actually change render output, passed in case it ever does.
  const propCases = [
    { name: 'no props' },
    { name: 'type', props: { type: 'Flame' } },
    { name: 'type and extra', props: { type: 'Base', display: 'inline' } }
  ];

  describe('Logo', () => {
    cases('Render:', (opts) => {
      const wrapper = render(<SparkPost.Logo {...opts.props} />);
      expect(wrapper).toMatchSnapshot();
    }, propCases);
  });

  describe('Icon', () => {
    cases('Render:', opts => {
      const wrapper = render(<SparkPost.Icon {...opts.props} />);
      expect(wrapper).toMatchSnapshot();
    }, propCases);
  });
});
