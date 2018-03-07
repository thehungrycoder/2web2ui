import React from 'react';

import { shallow } from 'enzyme';

import { RecipientListForm } from '../RecipientListForm';

describe('RecipientListForm', () => {
  let props;
  let formValues;
  let csv;

  beforeEach(() => {
    props = {
      handleSubmit: jest.fn()
    };
    formValues = {
      name: 'Freddie II Jr',
      id: 'fred-2-jr',
      description: 'Royalty amongst the fredericks'
    };

    csv = 'email,metadata\nscratch@example.com,"{""flavor"":""vanilla""}"\n';
  });

  it('defaults to create mode', () => {
    const wrapper = shallow(<RecipientListForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly in create mode', () => {
    const wrapper = shallow(<RecipientListForm editMode={false} {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly in edit mode', () => {
    const wrapper = shallow(<RecipientListForm editMode={true} {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders CSV errors', () => {
    const wrapper = shallow(<RecipientListForm editMode={false} {...props} />);
    const csvErrors = [
      'Line 73: Too many notes',
      'Line 247: Vanilla is unacceptable'
    ];
    wrapper.setProps({ error: csvErrors });
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable form elements on submit', () => {
    const wrapper = shallow(<RecipientListForm submitting={true} {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should submit without recipients', async() => {
    const onSubmit = jest.fn();
    const wrapper = shallow(<RecipientListForm onSubmit={onSubmit} {...props} />);
    await wrapper.instance().preSubmit(formValues);
    expect(onSubmit).toHaveBeenCalledWith(formValues);
  });

  it('should submit with recipients', async() => {
    const formValuesWithCsv = { csv, ...formValues };
    const parsedFormValues = {
      recipients: [
        {
          address: {
            email: 'scratch@example.com'
          },
          metadata: { flavor: 'vanilla' }
        }
      ],
      ...formValues
    };
    const onSubmit = jest.fn();
    const wrapper = shallow(<RecipientListForm onSubmit={onSubmit} {...props} />);
    await wrapper.instance().preSubmit(formValuesWithCsv);
    expect(onSubmit).toHaveBeenCalledWith(parsedFormValues);
  });

  it('should throw on submit if CSV parsing fails', () => {
    const csv = 'email,metadata\nscratchexample.com,"{""flavor"":""vanilla"""\n';
    const formValuesWithCsv = { csv, ...formValues };
    const onSubmit = jest.fn();
    const wrapper = shallow(<RecipientListForm onSubmit={onSubmit} {...props} />);
    expect(wrapper.instance().preSubmit(formValuesWithCsv)).rejects.toMatchSnapshot();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

