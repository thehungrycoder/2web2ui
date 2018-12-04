import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import EnforceTfaPanel from '../EnforceTfaPanel';
import ConfirmationModal from 'src/components/modals/ConfirmationModal';

describe('Component: EnforceTfaPanel', () => {
  const baseProps = {
    loading: false,
    ssoEnabled: false,
    tfaRequired: false,
    tfaUpdatePending: false,
    getAccountSingleSignOnDetails: () => {},
    updateAccountSingleSignOn: () => {},
    updateAccount: () => {}
  };

  function subject(props) {
    return shallow(<EnforceTfaPanel {...baseProps} {...props} />);
  }

  function modalWithTitle(wrapper, titleSubstr) {
    return wrapper.find(ConfirmationModal).filterWhere((node) => node.prop('title').includes(titleSubstr));
  }

  const enableModal = (wrapper) => modalWithTitle(wrapper, 'enforce two-factor');
  const disableModal = (wrapper) => modalWithTitle(wrapper, 'make two-factor authentication optional');

  it('renders loading state', () => {
    expect(subject({ loading: true })).toMatchSnapshot();
  });

  it('fetches account SSO status', () => {
    const getAccountSingleSignOnDetails = jest.fn();
    subject({ getAccountSingleSignOnDetails });
    expect(getAccountSingleSignOnDetails).toHaveBeenCalledTimes(1);
  });

  it('renders fully after loading', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders with sso enabled', () => {
    expect(subject({ ssoEnabled: true })).toMatchSnapshot();
  });

  cases('offers to enable/disable TFA required', ({ tfaRequired, modal }) => {
    const wrapper = subject({ tfaRequired });
    expect(modal(wrapper).prop('open')).toEqual(false);
    wrapper.instance().toggleTfaRequired();
    expect(modal(wrapper).prop('open')).toEqual(true);
  }, [
    { tfaRequired: false, modal: enableModal },
    { tfaRequired: true, modal: disableModal }
  ]);

  cases('cancels enable/disable modals', ({ tfaRequired, modal }) => {
    const wrapper = subject({ tfaRequired });
    wrapper.instance().toggleTfaRequired();
    modal(wrapper).prop('onCancel')();
    expect(modal(wrapper).prop('open')).toEqual(false);
  }, [
    { tfaRequired: false, modal: enableModal },
    { tfaRequired: true, modal: disableModal }
  ]);

  cases('sets TFA required', ({ tfaRequired, modal }) => {
    const updateAccount = jest.fn().mockResolvedValue();
    const wrapper = subject({ updateAccount });
    wrapper.instance().toggleTfaRequired();
    modal(wrapper).prop('onConfirm')();
    expect(updateAccount).toHaveBeenCalledWith({ tfa_required: !tfaRequired });
  }, [ { tfaRequired: true, modal: disableModal }, { tfaRequired: false, modal: enableModal } ]);
});
