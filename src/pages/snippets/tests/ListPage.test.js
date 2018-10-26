import React from 'react';
import { shallow } from 'enzyme';
import ListPage from '../ListPage';

describe('ListPage', () => {
  const subject = (props = {}) => shallow(
    <ListPage
      canCreate={true}
      getSnippets={() => {}}
      hasSubaccounts={true}
      snippets={[{ id: 'example-id', name: 'Example Snippet' }]}
      {...props}
    />
  );

  it('renders page with snippet collection', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('requests snippets when component is mounted', () => {
    const getSnippets = jest.fn();
    subject({ getSnippets });
    expect(getSnippets).toHaveBeenCalled();
  });

  it('renders loading page', () => {
    expect(subject({ loading: true })).toMatchSnapshot();
  });

  it('renders page without primary action button', () => {
    expect(subject({ canCreate: false })).toMatchSnapshot();
  });

  it('renders page with error banner', () => {
    expect(subject({ error: new Error('Oh no!') })).toMatchSnapshot();
  });

  it('renders page without subaccount column', () => {
    expect(subject({ hasSubaccounts: false })).toMatchSnapshot();
  });

  it('shows empty state', () => {
    const wrapper = subject({ snippets: []});
    expect(wrapper.prop('empty')).toHaveProperty('show', true);
  });
});
