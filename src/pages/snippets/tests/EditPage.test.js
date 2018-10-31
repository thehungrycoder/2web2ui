import React from 'react';
import { shallow } from 'enzyme';
import EditPage from '../EditPage';

describe('EditPage', () => {
  const subject = (props = {}) => shallow(
    <EditPage
      canModify={true}
      getSnippet={() => {}}
      handleSubmit={(fn) => fn}
      hasSubaccounts={true}
      {...props}
    />
  );

  it('renders edit form', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('redirects with alert when load request fails', () => {
    const wrapper = subject({ error: new Error('Oh no!') });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders loading', () => {
    const wrapper = subject({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders without subaccount section when account has no subaccounts', () => {
    const wrapper = subject({ hasSubaccounts: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders disabled form when submitting', () => {
    const wrapper = subject({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders disabled form when user does not have authorization to modify snippets', () => {
    const wrapper = subject({ canModify: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('requests snippet on mount', () => {
    const getSnippet = jest.fn();
    subject({ getSnippet, id: 123, subaccountId: 345 });
    expect(getSnippet).toHaveBeenCalledWith({ id: 123, subaccountId: 345 });
  });

  it('clears snippet on unmount', () => {
    const clearSnippet = jest.fn();
    const wrapper = subject({ clearSnippet });

    wrapper.instance().componentWillUnmount();
    expect(clearSnippet).toHaveBeenCalled();
  });

  it('requests snippet update on submit', async () => {
    const showAlert = jest.fn();
    const updateSnippet = jest.fn(() => Promise.resolve());
    const wrapper = subject({ showAlert, updateSnippet });

    await wrapper.prop('primaryAction').onClick({
      content: {
        html: '<p>Testing</p>'
      },
      id: 'test-snippet',
      name: 'Test Snippet',
      shared_with_subaccounts: false,
      subaccount: {
        id: 345
      }
    });

    expect(updateSnippet).toHaveBeenCalledWith({
      html: '<p>Testing</p>',
      id: 'test-snippet',
      name: 'Test Snippet',
      sharedWithSubaccounts: false,
      subaccountId: 345,
      text: undefined
    });
    expect(showAlert).toHaveBeenCalled();
  });
});
