import { shallow } from 'enzyme';
import React from 'react';
import SnippetCollection from '../SnippetCollection';

describe('SnippetCollection', () => {
  const subject = (props = {}) => shallow(
    <SnippetCollection snippets={[{ id: 'test-snippet' }]} {...props} />
  );

  it('renders table collection', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders table collection with subaccount column', () => {
    const wrapper = subject({ hasSubaccounts: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders table collection with actions column', () => {
    const wrapper = subject({ canCreate: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a table collection row', () => {
    const wrapper = subject();
    const instance = wrapper.instance();
    const Row = instance.renderRow(instance.columns);

    expect(shallow(<Row id="test-snippet" />)).toMatchSnapshot();
  });

  it('renders actions table data with toggleDelete callback', () => {
    const toggleDelete = jest.fn();
    const wrapper = subject({ toggleDelete });
    const Actions = wrapper.instance().columns[3].component;

    expect(shallow(<Actions id="test-snippet" />)).toMatchSnapshot();
  });
});
