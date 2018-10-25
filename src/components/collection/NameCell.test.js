import React from 'react';
import { shallow } from 'enzyme';
import NameCell from './NameCell';

describe('NameCell', () => {
  const subject = (props) => (
    shallow(<NameCell id="example-item" to="/example/item" {...props} />)
  );

  it('renders with id as name', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders with a name', () => {
    expect(subject({ name: 'The Example Item' })).toMatchSnapshot();
  });
});
