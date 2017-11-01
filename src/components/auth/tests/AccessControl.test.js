import React from 'react';
import { shallow } from 'enzyme';
import { AccessControl } from '../AccessControl';

describe('Component: AccessControl', () => {

  it('should render correctly when no access but not ready to redirect', () => {
    const component = <AccessControl redirect='/some/path' show={false} ready={false}><h1>Some children</h1></AccessControl>;
    expect(shallow(component)).toMatchSnapshot();
  });

  it('should render correctly when no access and ready to redirect', () => {
    const component = <AccessControl redirect='/some/path' show={false} ready={true}><h1>Some children</h1></AccessControl>;
    expect(shallow(component)).toMatchSnapshot();
  });

  it('should render correctly when no access and not redirecting', () => {
    const component = <AccessControl show={false} ready={true}><h1>Some children</h1></AccessControl>;
    expect(shallow(component)).toMatchSnapshot();
  });

  it('should render correctly when access is granted', () => {
    const component = <AccessControl show={true} ready={true}><h1>Some children</h1></AccessControl>;
    expect(shallow(component)).toMatchSnapshot();
  });

});
