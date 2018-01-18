import { shallow } from 'enzyme';
import React from 'react';
import * as dateHelpers from 'src/helpers/date';
import Detail from '../Detail';

jest.mock('src/helpers/date');

let props;
let wrapper;

beforeEach(() => {
  dateHelpers.formatDateTime = jest.fn(() => 'formatted-date');
  props = {
    open: false,
    onCancel: jest.fn(),
    suppression: {
      recipient: 'foo@bar.com',
      description: '',
      updated: '2018-01-16T04:14:18.661Z',
      created: '2018-01-16T04:14:18.661Z'
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

