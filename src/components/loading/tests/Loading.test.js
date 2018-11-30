import React from 'react';
import { LoadingSVG, LoadingLogoSVG } from '../Loading';
import { render } from 'enzyme';

describe('Loading Component', () => {

  describe('Circle', () => {
    it('should render - no props', () => {
      const wrapper = render(<LoadingSVG />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a specific size (small)', () => {
      const wrapper = render(<LoadingSVG size = 'Small' />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a specific style (center)', () => {
      const wrapper = render(<LoadingSVG className = 'Center' />);
      expect(wrapper).toMatchSnapshot();
    });

  });

  describe('Logo', () => {
    it('should render - no props', () => {
      const wrapper = render(<LoadingLogoSVG />);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
