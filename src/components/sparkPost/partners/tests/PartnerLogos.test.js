import React from 'react';
import PartnerLogos from '../PartnerLogos';
import { render } from 'enzyme';

describe('SparkPost Partner Logos', () => {
  describe('AwsMP', () => {
    it('renders correctly', () => {
      const wrapper = render(<PartnerLogos.AwsMP />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
