import { shallow } from 'enzyme';
import React from 'react';
import { SpamTrapsPage } from '../SpamTrapsPage';

describe('Signals Spam Traps Page', () => {
  let wrapper;

  beforeEach(() => {
    const props = {};
    wrapper = shallow(<SpamTrapsPage {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
