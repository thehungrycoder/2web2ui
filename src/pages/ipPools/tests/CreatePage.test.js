import { shallow } from 'enzyme';
import React from 'react';
import { CreatePage } from '../CreatePage';

describe('IP Pools Create Page', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      createPool: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      history: {
        push: jest.fn()
      },
      loading: false
    };

    wrapper = shallow(<CreatePage {...props} />);
  });

  it('should render the list page correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show loading component when data is loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show an alert on successful pool creation', async() => {
    await wrapper.instance().createPool({ name: 'my-pool' });
    expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'Created IP pool my-pool.'
    });
    expect(wrapper.instance().props.history.push).toHaveBeenCalled();

  });

  it('should show an error alert on failed pool creation', async() => {
    wrapper.setProps({ createPool: jest.fn(() => Promise.reject(new Error('failed pool creation'))) });
    await wrapper.instance().createPool({ name: 'my-pool' });
    expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({
      type: 'error',
      message: 'Unable to create IP pool. Please try again!'
    });
    expect(wrapper.instance().props.history.push).not.toHaveBeenCalled();

  });

});
