import React from 'react';
import App from '../App';
import Form from '../Form';
import { shallow } from 'enzyme';

describe('Layout Tests', () => {
  test('Layout renders App layout', () => {
    const component = shallow(
      <App>App Layout</App>
    );
    expect(component).toMatchSnapshot();
  });

  test('Layout renders Form layout', () => {
    const component = shallow(
      <Form>Form Layout</Form>
    );
    expect(component).toMatchSnapshot();
  });
});
