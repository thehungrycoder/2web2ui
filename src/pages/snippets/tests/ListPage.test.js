import React from 'react';
import { shallow } from 'enzyme';
import ListPage, { Name, Subaccount, UpdatedAt } from '../ListPage';

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

  it('renders page with table collect', () => {
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

  describe('Name', () => {
    it('renders name data cell', () => {
      const wrapper = shallow(<Name id="example-id" name="Example Name" />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Subaccount', () => {
    it('returns null', () => {
      const wrapper = shallow(<Subaccount />);
      expect(wrapper.html()).toBeNull();
    });

    it('returns a tag', () => {
      const wrapper = shallow(<Subaccount shared_with_subaccounts={false} subaccount_id={999} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('UpdatedAt', () => {
    it('returns created at', () => {
      const wrapper = shallow(<UpdatedAt created_at="2017-08-10T14:15:16+00:00" />);
      expect(wrapper).toMatchSnapshot();
    });

    it('returns updated at', () => {
      const wrapper = shallow(
        <UpdatedAt
          created_at="2017-08-10T14:15:16+00:00"
          updated_at="2017-09-10T14:15:16+00:00"
        />
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});
