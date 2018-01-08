import { shallow } from 'enzyme';
import React from 'react';

import { FilterForm } from '../EmailSearch';
import * as validators from 'src/helpers/validation';

jest.mock('src/helpers/validation');

let props;
let wrapper;
let instance ;

beforeEach(() => {
  props = {
    onSubmit: jest.fn(() => Promise.resolve())
  };

  validators.email = jest.fn();

  wrapper = shallow(<FilterForm {...props} />);
  instance = wrapper.instance();

});

describe('EmailSearch', () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with subaccounts', () => {
    wrapper.setProps({ hasSubaccounts: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('handleChange', () => {
    let mockEvent;
    beforeEach(() => {
      mockEvent = {
        target: {
          value: 'foo@bar.com'
        }
      };
    });

    it('does not refresh if email is unchanged', () => {
      wrapper.setState({ email: 'foo@bar.com' });
      instance.handleChange(mockEvent);
      expect(props.onSubmit).toHaveBeenCalledTimes(0);
    });

    it('refreshes on value change', () => {
      mockEvent.target.value = 'foo2@bar.com';
      instance.handleChange(mockEvent);
      expect(wrapper.state().email).toEqual('foo2@bar.com');
      expect(props.onSubmit).toHaveBeenCalledTimes(1);
      expect(props.onSubmit).toHaveBeenCalledWith({ email: 'foo2@bar.com', subaccountId: null });
    });
  });

  describe('handleSubaccountSelect', () => {
    beforeEach(() => {
      wrapper.setState({ email: 'foo@bar.com' });
    });

    it('sets state and refreshes with correct params', () => {
      instance.handleSubaccountSelect({ id: 100 });
      expect(props.onSubmit).toHaveBeenCalledTimes(1);
      expect(wrapper.state().subaccountId).toEqual(100);
      expect(props.onSubmit).toHaveBeenCalledWith({ email: 'foo@bar.com', subaccountId: 100 });

      props.onSubmit.mockClear();
      instance.handleSubaccountSelect({ id: 200 });
      expect(props.onSubmit).toHaveBeenCalledTimes(1);
      expect(wrapper.state().subaccountId).toEqual(200);
      expect(props.onSubmit).toHaveBeenCalledWith({ email: 'foo@bar.com', subaccountId: 200 });

    });
  });

  describe('refresh', () => {
    let params;

    beforeEach(() => {
      params = { email: 'foo@bar.com', subaccountId: 101 };
      wrapper.setState(params);
    });

    it('refreshes with correct parameter', () => {
      instance.refresh();
      expect(props.onSubmit).toHaveBeenCalledTimes(1);
      expect(props.onSubmit).toHaveBeenCalledWith(params);
      expect(validators.email).toHaveBeenCalledTimes(1);
    });

    it('does not refresh if email validation fails', () => {
      validators.email.mockReturnValue('invalid');
      instance.refresh();
      expect(props.onSubmit).toHaveBeenCalledTimes(0);
      expect(validators.email).toHaveBeenCalledTimes(1);
    });
  });
});
