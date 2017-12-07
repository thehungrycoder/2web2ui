import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import { ApiKeySuccessBanner } from '../index';
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
    const banner = new ApiKeySuccessBanner();
    banner.props = { newKey: 'foo' };
    banner.setState = jest.fn();
    banner.onClickBanner();
    expect(banner.setState).toHaveBeenCalledWith({ copied: true });
  });

});
