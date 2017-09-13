import React from 'react';
import Layout from '../Layout';
import { shallow } from 'enzyme';

describe('Layout Tests', () => {
  test('Layout renders App layout', () => {
    const component = shallow(
        <Layout.App>App Layout</Layout.App>
    );
    expect(component).toMatchSnapshot();
  });

  test('Layout renders Form layout', () => {
    const component = shallow(
        <Layout.Form>Form Layout</Layout.Form>
    );
    expect(component).toMatchSnapshot();
  });
});
