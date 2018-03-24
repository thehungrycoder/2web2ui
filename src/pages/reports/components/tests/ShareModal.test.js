import React from 'react';
import { shallow } from 'enzyme';
import { ShareModal } from '../ShareModal';
import * as dateHelpersMock from 'src/helpers/date';
import { WindowEvent } from '@sparkpost/matchbox';

jest.mock('src/helpers/date');

describe('Component: ShareModal', () => {

  let wrapper;
  let testProps;

  beforeEach(() => {
    dateHelpersMock.relativeDateOptions = [
      { value: 'valid', label: 'Valid Labels Ago' }
    ];
    testProps = {
      query: { range: 'valid' },
      handleToggle: jest.fn(),
      searchOptions: {
        range: 'valid'
      },
      location: {},
      history: {
        replace: jest.fn()
      }
    };
    wrapper = shallow(<ShareModal {...testProps} />);
  });

  it('should render correctly when not open', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('updates the link if options are changed', () => {
    testProps.history.replace.mockReset();
    wrapper.setProps({ searchOptions: { range: '7days' }});
    expect(testProps.history.replace).toHaveBeenCalledTimes(1);
  });

  it('should render correctly when open', () => {
    wrapper.setState({ open: true });
    expect(wrapper).toMatchSnapshot();
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
    wrapper.setState({ open: true }); //open modal first

    const keydown = wrapper.find(WindowEvent).props().handler;
    keydown({ key: 'Escape' });
    expect(wrapper.state().open).toBe(false);

    wrapper.setState({ open: true });
    keydown({ key: 'Enter' });
    expect(wrapper.state().open).toBe(false);

    wrapper.setState({ open: true });
    keydown({ key: 'Space' }); //shouldn't do anything
    expect(wrapper.state().open).toBe(true);
  });
});
