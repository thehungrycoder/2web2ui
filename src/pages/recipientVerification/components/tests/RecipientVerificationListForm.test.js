import React from 'react';

import { shallow } from 'enzyme';

import { RecipientVerificationListForm } from '../RecipientVerificationListForm';

describe('RecipientVerificationListForm', () => {
  let props;
  let formValuesWithCsv;

  beforeEach(() => {
    props = {
      handleSubmit: jest.fn()
    };

    formValuesWithCsv = {
      csv: 'email,foo@address.com\nbar@address.com\n'
    };
  });

  it('defaults to create mode', () => {
    const wrapper = shallow(<RecipientVerificationListForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly in create mode', () => {
    const wrapper = shallow(<RecipientVerificationListForm editMode={false} {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly in edit mode', () => {
    const wrapper = shallow(<RecipientVerificationListForm editMode={true} {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders CSV errors', () => {
    const wrapper = shallow(<RecipientVerificationListForm editMode={false} {...props} />);
    const csvErrors = [
      'Line 73: Too many notes',
      'Line 247: Vanilla is unacceptable'
    ];
    wrapper.setProps({ error: csvErrors });
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable form elements on submit', () => {
    const wrapper = shallow(<RecipientVerificationListForm submitting={true} {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should submit csv', async () => {
    const onSubmit = jest.fn();
    const wrapper = shallow(<RecipientVerificationListForm onSubmit={onSubmit} {...props} />);
    await wrapper.instance().createForm(formValuesWithCsv);
    expect(onSubmit).toHaveBeenCalledWith(formValuesWithCsv);
  });

  it('should throw on submit if CSV parsing fails', () => {
    formValuesWithCsv.csv = 'email,metadata\nscratchexample.com,"{""flavor"":""vanilla"""\n';
    const onSubmit = jest.fn();
    const wrapper = shallow(<RecipientVerificationListForm onSubmit={onSubmit} {...props} />);
    expect(wrapper.instance().createForm(formValuesWithCsv)).rejects.toMatchSnapshot();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

