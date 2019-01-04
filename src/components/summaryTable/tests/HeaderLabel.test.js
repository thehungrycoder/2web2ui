import React from 'react';
import { shallow } from 'enzyme';
import HeaderLabel from '../HeaderLabel';

describe('HeaderLabel', () => {
  const subject = (props = {}) => shallow(
    <HeaderLabel
      dataKey="test-example"
      label="Test Example"
      sortable={true}
      {...props}
    />
  );

  it('renders a sortable label', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders label', () => {
    const wrapper = subject({ label: 'Identifier', sortable: false });
    expect(wrapper.text()).toEqual('Identifier');
  });

  it('calls onSort callback with ascending order', () => {
    const onSort = jest.fn();
    const wrapper = subject({ onSort });

    wrapper.simulate('click');

    expect(onSort).toHaveBeenCalledWith({ ascending: true, dataKey: 'test-example' });
  });

  it('calls onSort callback with descending order', () => {
    const onSort = jest.fn();
    const wrapper = subject({ onSort, order: { ascending: true, dataKey: 'test-example' }});

    wrapper.simulate('click');

    expect(onSort).toHaveBeenCalledWith({ ascending: false, dataKey: 'test-example' });
  });

  it('calls onSort callback with undefined order', () => {
    const onSort = jest.fn();
    const wrapper = subject({ onSort, order: { ascending: false, dataKey: 'test-example' }});

    wrapper.simulate('click');

    expect(onSort).toHaveBeenCalledWith(undefined);
  });

  it('renders ascending sorted label', () => {
    const wrapper = subject({
      order: {
        ascending: true,
        dataKey: 'test-example'
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('renders descending sorted label', () => {
    const wrapper = subject({
      order: {
        ascending: false,
        dataKey: 'test-example'
      }
    });

    expect(wrapper).toMatchSnapshot();
  });
});
