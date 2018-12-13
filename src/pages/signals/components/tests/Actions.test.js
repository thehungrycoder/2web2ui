import { shallow } from 'enzyme';
import React from 'react';
import Actions from '../Actions';

describe('Signals Recommended Actions Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      actions: [
        { content: 'foo', link: 'http://google.com' },
        { content: 'bar' }
      ],
      date: new Date('2018-01-01')
    };
    wrapper = shallow(<Actions {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
    wrapper.find('Action').forEach((node) => {
      expect(node.dive()).toMatchSnapshot();
    });
  });

  it('renders nothing with no actions', () => {
    wrapper.setProps({ actions: null });
    expect(wrapper.html()).toBeNull();
    wrapper.setProps({ actions: []});
    expect(wrapper.html()).toBeNull();
  });
});
