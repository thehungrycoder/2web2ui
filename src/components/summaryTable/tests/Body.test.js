import React from 'react';
import { shallow } from 'enzyme';
import Body from '../Body';

describe('Body', () => {
  const subject = (props = {}) => shallow(
    <Body
      columns={[{ dataKey: 'id' }, { dataKey: 'value' }]}
      {...props}
    />
  );

  it('renders a table body', () => {
    const wrapper = subject({
      data: [{ id: 'test-example', value: 123 }],
      perPage: 1
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('renders loading', () => {
    expect(subject({ loading: true })).toMatchSnapshot();
  });

  it('renders error message', () => {
    expect(subject({ error: 'Oh no!' })).toMatchSnapshot();
  });

  it('renders empty message', () => {
    expect(subject({ empty: true })).toMatchSnapshot();
  });

  it('renders max of perPage rows', () => {
    const wrapper = subject({
      data: [
        { id: 'test-example', value: 123 },
        { id: 'another-test-example', value: 234 }
      ],
      perPage: 1
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('renders custom component', () => {
    const wrapper = subject({
      columns: [
        { dataKey: 'id' },
        { dataKey: 'value', component: (row) => `${row.value}%` }
      ],
      data: [{ id: 'test-example', value: 123 }],
      perPage: 1
    });

    expect(wrapper).toMatchSnapshot();
  });
});
