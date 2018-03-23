import React from 'react';
import App from '../App';
import { shallow } from 'enzyme';

describe('Component: App Layout', () => {

  it('should render correctly', () => {
    expect(shallow(<App><h1>My cool af children</h1></App>)).toMatchSnapshot();
  });

});
