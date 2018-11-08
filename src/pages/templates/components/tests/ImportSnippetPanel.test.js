import React from 'react';
import { shallow } from 'enzyme';
import ImportSnippetPanel from '../ImportSnippetPanel';

describe('ImportSnippetPanel', () => {
  const subject = (props = {}) => shallow(
    <ImportSnippetPanel getSnippets={() => {}} {...props} />
  );

  it('renders panel', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('requests snippets on mount', () => {
    const getSnippets = jest.fn();
    subject({ getSnippets });
    expect(getSnippets).toHaveBeenCalled();
  });

  it('renders loading panel', () => {
    const wrapper = subject({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('selects snippet for display', () => {
    const wrapper = subject();
    wrapper.find('Typeahead').simulate('change', { id: 'test-snippet' });
    expect(wrapper.state('snippetId')).toEqual('test-snippet');
  });

  it('clears selected snippet', () => {
    const wrapper = subject();
    wrapper.find('Typeahead').simulate('change', null);
    expect(wrapper.state('snippetId')).toBeUndefined();
  });

  it('closes modal', () => {
    const onClose = jest.fn();
    const wrapper = subject({ onClose });
    wrapper.find('Button').simulate('click');
    expect(onClose).toHaveBeenCalled();
  });
});
