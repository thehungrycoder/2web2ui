import { shallow } from 'enzyme';
import React from 'react';
import cases from 'jest-in-case';

import StatusDescription from '../StatusDescription';

import { verificationCases } from '../../tests/domain';

describe('StatusDescription component', () => {
  let props;
  let wrapper;

  describe('Shallow tests', () => {
    beforeEach(() => {
      props = {
        name: 'example.com',
        status: 'unverified',
        readyFor: {
          sending: false,
          bounce: false,
          dkim: false
        },
        shared: false,
        bounceDefault: false
      };
      wrapper = shallow(<StatusDescription {...props} />);
    });

    cases('renders verification status correctly', ({ status }) => {
      wrapper.setProps({ status });
      expect(wrapper).toMatchSnapshot();
    }, verificationCases);

    it('does not render subaccount details on master account domains', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders subaccount details', () => {
      wrapper.setProps({ subaccount: 101 });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders subaccount sharing details', () => {
      wrapper.setProps({ shared: true });
      expect(wrapper).toMatchSnapshot();
    });
  });
});

