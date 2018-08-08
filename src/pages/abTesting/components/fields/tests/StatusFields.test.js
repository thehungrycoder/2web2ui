import { shallow } from 'enzyme';
import React from 'react';
import StatusFields from '../StatusFields';

describe('Status Fields Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    const mockNow = new Date('2018-05-15T12:00:00.000Z');
    global.Date = jest.fn(() => mockNow);

    props = {
      diabled: false
    };
    wrapper = shallow(<StatusFields {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable fields correctly', () => {
    wrapper.setProps({ disabled: true });
    expect(wrapper).toMatchSnapshot();
  });
});
