import React from 'react';

import { shallow } from 'enzyme';

import { ListForm } from '../ListForm';

describe('ListForm', () => {
  let props;
  let formValuesWithCsv;
  let wrapper;

  beforeEach(() => {
    props = {
      handleSubmit: jest.fn((a) => a),
      uploadList: jest.fn(() => Promise.resolve()),
      reset: jest.fn(),
      showAlert: jest.fn()
    };

    wrapper = shallow(<ListForm {...props} />);

    formValuesWithCsv = {
      csv: 'email,foo@address.com\nbar@address.com\n'
    };
  });

  it('renders correctly', () => {
    wrapper.setProps(props);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders CSV errors', () => {
    wrapper.setProps(props);
    const csvErrors = [
      'Line 73: Too many notes',
      'Line 247: Vanilla is unacceptable'
    ];
    wrapper.setProps({ error: csvErrors });
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable form elements on submit', () => {
    wrapper.setProps(props);
    expect(wrapper).toMatchSnapshot();
  });

  it('should submit csv', async () => {
    wrapper.setProps(props);
    wrapper.find('form').simulate('submit', formValuesWithCsv);
    await expect(props.uploadList.mock.calls).toMatchSnapshot();
    expect(props.reset).toHaveBeenCalledWith('recipientValidationListForm');
    expect(props.showAlert.mock.calls).toMatchSnapshot();
  });
});
