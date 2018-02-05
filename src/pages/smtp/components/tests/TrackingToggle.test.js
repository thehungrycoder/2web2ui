import { shallow } from 'enzyme';
import React from 'react';

import { DefaultTrackingForm } from '../TrackingToggle';

describe('Page: Smtp tests', () => {
  const props = {
    updateLoading: false,
    initialValues: {
      account: {
        options: {
          smtp_tracking_default: true
        }
      }
    },
    toggle: jest.fn()
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DefaultTrackingForm {...props} />);
  });

  it('should render form correctly with defaults', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable form when updateLoading is true', () => {
    wrapper.setProps({ updateLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onChange when form changes', () => {
    wrapper.find('Field').simulate('change');
    expect(wrapper.instance().props.toggle).toHaveBeenCalled();
  });
});
