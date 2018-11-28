import React from 'react';
import { Loading, LoadingSVG, LoadingLogoSVG } from '../Loading';
import { render } from 'enzyme';

describe('Loading Component', () => {

  describe('Loading animation', () => {

    it('should not render hidden is true', () => {
      const wrapper = render(<Loading hidden = {true}/>);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render when calculating', () => {
      const wrapper = render(<Loading hidden = {false} isForTypeahead={true}/>);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Circle', () => {
    it('should render - no props', () => {
      const wrapper = render(<LoadingSVG />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render - small', () => {
      const wrapper = render(<LoadingSVG small />);
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
