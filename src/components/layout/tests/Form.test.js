import React from 'react';
import Form from '../Form';
import { shallow } from 'enzyme';

describe('Component: Form Layout', () => {

  it('should render correctly', () => {
    expect(shallow(<Form><h1>My cool af children</h1></Form>)).toMatchSnapshot();
  });

});
