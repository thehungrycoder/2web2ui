import { shallow } from 'enzyme';
import React from 'react';

import { PublishedPage } from '../PublishedPage';

describe('Template PublishedPage', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      match: {
        params: { id: 'id' }
      },
      getPublished: jest.fn(() => Promise.resolve()),
      getTestData: jest.fn()
    };

    wrapper = shallow(<PublishedPage {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.getTestData).toHaveBeenCalledWith({ id: 'id', mode: 'published' });
    expect(props.getPublished).toHaveBeenCalledWith('id');
  });

  it('should render loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find('Loading')).toHaveLength(1);
  });
});
