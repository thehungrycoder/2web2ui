import React from 'react';
import { shallow } from 'enzyme';
import { AccountSettingsPage } from '../AccountSettingsPage';
import { AccessControl } from 'src/components/auth';
import cases from 'jest-in-case';

describe('AccountSettingsPage', () => {
  const baseProps = {
    currentUser: {
      customer: 123123
    }
  };

  function subject(props) {
    return shallow(<AccountSettingsPage {...baseProps} {...props} />);
  }

  it('renders', () => {
    expect(subject()).toMatchSnapshot();
  });

  cases(
    'enforce-TFA panel access control',
    (opts) => {
      const wrapper = subject();
      const condition = wrapper
        .find(AccessControl)
        .first()
        .prop('condition');
      expect(
        condition({
          account: { options: { ui: opts.options }}
        })
      ).toEqual(opts.expectation);
    },
    [{ options: { tfaRequired: true }, expectation: true }, { options: {}, expectation: false }]
  );
});
