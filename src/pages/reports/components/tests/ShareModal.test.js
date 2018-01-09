import React from 'react';
import { shallow } from 'enzyme';
import ShareModal from '../ShareModal';
import * as dateHelpersMock from 'src/helpers/date';
import { WindowEvent, Panel } from '@sparkpost/matchbox';
import { Modal } from 'src/components';

jest.mock('src/helpers/date');

describe('Component: ShareModal', () => {

  let wrapper;
  let testProps;

  beforeEach(() => {
    dateHelpersMock.relativeDateOptions = [
      { value: 'valid', label: 'Valid Labels Ago' }
    ];
    testProps = {
      open: true,
      query: { range: 'valid' },
      handleToggle: jest.fn()
    };
    wrapper = shallow(<ShareModal {...testProps} />);
  });

  it('should render correctly when not open', () => {
    expect(shallow(<ShareModal />)).toMatchSnapshot();
  });

  it('should render correctly when open', () => {
    expect(shallow(<ShareModal open={true} />)).toMatchSnapshot();
  });

  it('should render with a valid relative range', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state('pinned')).toEqual(true);
  });

  it('should unpin when clicking the checkbox', () => {
    expect(wrapper.state('pinned')).toEqual(true);
    wrapper.find('#pin-relative-link').simulate('change');
    expect(wrapper.state('pinned')).toEqual(false);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle keydown events correctly', () => {
    const keydown = wrapper.find(WindowEvent).props().handler;

    keydown({ key: 'Escape' });
    expect(testProps.handleToggle).toHaveBeenCalledTimes(1);

    testProps.handleToggle.mockClear();

    keydown({ key: 'Enter' });
    expect(testProps.handleToggle).toHaveBeenCalledTimes(1);

    testProps.handleToggle.mockClear();

    keydown({ key: 'Space' });
    expect(testProps.handleToggle).toHaveBeenCalledTimes(0);
  });

  it('should toggle the modal on clicks outside the contents of the modal', () => {
    wrapper.find(Modal).simulate('click');
    expect(testProps.handleToggle).toHaveBeenCalledTimes(1);
  });

  it('should block propagation of clicks on the contents of the modal', () => {
    const e = { stopPropagation: jest.fn() };
    wrapper.find(Panel).simulate('click', e);
    expect(e.stopPropagation).toHaveBeenCalledTimes(1);
    expect(testProps.handleToggle).not.toHaveBeenCalled();
  });

});
