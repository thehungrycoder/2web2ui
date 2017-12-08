import React from 'react';
import { shallow, mount } from 'enzyme';
import { ApiKeySuccessBanner } from '../ApiKeyBanner';
jest.mock('copy-to-clipboard');

describe('ApiKeyBanner Component', () => {
  const props = {
    title: 'congrats on your new key',
    hideNewApiKey: jest.fn(),
    newKey: 'nuevo-llave'
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ApiKeySuccessBanner {...props} />);
  });

  it('should render default success message', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should change content when key is copied', () => {
    wrapper.setState({ copied: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call hideNewApiKey on click', () => {
    expect(props.hideNewApiKey).not.toHaveBeenCalled();
    wrapper.find('Banner').simulate('dismiss');
    expect(props.hideNewApiKey).toHaveBeenCalledTimes(1);
  });

  it('should set copied state to true on click', () => {
    const wrapper = mount(<ApiKeySuccessBanner {...props} />);
    expect(wrapper.state('copied')).toEqual(false);
    wrapper.find('button').simulate('click');
    expect(wrapper.state('copied')).toEqual(true);
  });

});
