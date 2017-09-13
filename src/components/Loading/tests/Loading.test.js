import React from 'react';
import { Loading, LoadingLogo } from '../Loading';


describe('Loading Component', () => {

  describe('Circle', () => {
    it('should render - no props', () => {
      const wrapper = render(<Loading />);

      expect(wrapper).toMatchSnapshot();
    });

  });

  describe('Logo', () => {
    it('should render - no props', () => {
      const wrapper = render(<LoadingLogo />);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
