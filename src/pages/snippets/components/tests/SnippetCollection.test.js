import { shallow } from 'enzyme';
import React from 'react';
import SnippetCollection from '../SnippetCollection';

describe('SnippetCollection', () => {
  // pass-through to test the render prop
  const subject = ({ open, ...props } = {}) => {
    const wrapper = shallow(
      <SnippetCollection snippets={[{ id: 'test-snippet' }]} {...props} />
    );
    const RenderProp = wrapper.prop('children');

    return shallow(<RenderProp open={open} />);
  };

  it('renders table collection', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders table collection with subaccount column', () => {
    const wrapper = subject({ hasSubaccounts: true });
    expect(wrapper.prop('columns')).toContainEqual(expect.objectContaining({ label: 'Subaccount' }));
  });

  it('renders table collection with actions column', () => {
    const wrapper = subject({ canCreate: true });
    expect(wrapper.prop('columns')).toContain(null);
  });

  it('renders a table collection row with modal callback', () => {
    const open = jest.fn();
    const wrapper = subject({ canCreate: true, hasSubaccounts: true, open });
    const Row = wrapper.prop('getRowData');

    expect(shallow(<Row id="test-snippet" />)).toMatchSnapshot();
  });
});
