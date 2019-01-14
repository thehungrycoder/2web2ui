import { shallow } from 'enzyme';
import React from 'react';
import SignalsPage from '../SignalsPage';

describe('Signals Page Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      title: 'test title',
      pass: 'through'
    };
    wrapper = shallow(<SignalsPage {...props}/>);
  });

  it('renders correctly with title', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with default title', () => {
    wrapper.setProps({ title: undefined });
    expect(wrapper).toMatchSnapshot();
  });
});
