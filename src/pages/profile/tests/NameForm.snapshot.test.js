import { shallow } from 'enzyme';
import React from 'react';
import { NameForm } from '../NameForm';

describe('Component: NameForm', () => {
  it('should render correctly', () => {
    expect(shallow(<NameForm />)).toMatchSnapshot();
  });
});

