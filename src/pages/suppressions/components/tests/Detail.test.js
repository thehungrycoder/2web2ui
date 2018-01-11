import { shallow } from 'enzyme';
import React from 'react';

import Detail from '../Detail';

let props;
let wrapper;

beforeEach(() => {
  props = {
    open: false,
    onCancel: jest.fn(),
    suppression: {
      recipient: 'foo@bar.com',
      description: ''
    }
  };

  wrapper = shallow(<Detail {...props} />);
});

describe('Detail', () => {
  it('renders correctly (hides) on initial loading', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly (shows) when open is true ', () => {
    wrapper.setProps({ open: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('closes modal upon clicking Close button', () => {
    wrapper.find('Button').simulate('click');
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders correctly (shows loading) when deleting', () => {
    wrapper.setProps({ deleting: true });
    expect(wrapper).toMatchSnapshot();
  });

});

