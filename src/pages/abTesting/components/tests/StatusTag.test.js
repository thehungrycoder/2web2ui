import { shallow } from 'enzyme';
import React from 'react';
import StatusTag from '../StatusTag';

describe('Status Tag Component', () => {
  it('should render draft', () => {
    expect(shallow(<StatusTag status={'draft'}/>)).toMatchSnapshot();
  });

  it('should render scheduled', () => {
    expect(shallow(<StatusTag status={'scheduled'}/>)).toMatchSnapshot();
  });

  it('should render running', () => {
    expect(shallow(<StatusTag status={'running'}/>)).toMatchSnapshot();
  });

  it('should render cancelled', () => {
    expect(shallow(<StatusTag status={'cancelled'}/>)).toMatchSnapshot();
  });

  it('should render completed', () => {
    expect(shallow(<StatusTag status={'completed'}/>)).toMatchSnapshot();
  });
});
