import React from 'react';
import { shallow } from 'enzyme';

import FileInput from '../FileInput';

describe('FileInput component', () => {
  let wrapper;

  // redux-form <Field /> props
  let fieldProps;
  let onChange;
  let onBlur;

  beforeEach(() => {
    onChange = jest.fn();
    onBlur = jest.fn();
    fieldProps = {
      meta: { touched: false, error: false },
      input: { onChange, onBlur }
    };
    wrapper = shallow(<FileInput {...fieldProps}>Pick a file</FileInput>);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should accept a string', () => {
    const accept = '*.png,*.jpg,image/*';
    wrapper = shallow(<FileInput accept={accept} {...fieldProps}>Choooose</FileInput>);
    expect(wrapper.find('input').matchesElement(<input type='file' accept={accept} />)).toEqual(true);
  });

  it('should accept an array of strings', () => {
    const acceptList = ['*.venkeman', '*.slimer'];
    const acceptStr = acceptList.join(',');
    wrapper = shallow(<FileInput accept={acceptList} {...fieldProps}>Choose and perish!</FileInput>);
    expect(wrapper.find('input').matchesElement(<input type='file' accept={acceptStr} />)).toEqual(true);
  });

  it('should display errors', () => {
    fieldProps.meta.touched = true;
    fieldProps.meta.error = 'Too many notes';
    wrapper = shallow(<FileInput {...fieldProps}>Pick it!</FileInput>);
    expect(wrapper.find('Error').exists()).toEqual(true);
  });

  it('should fire onChange and onBlur on change', () => {
    const evt = {
      target: {
        files: [{ name: 'animal.png', size: 54321 }]
      }
    };
    wrapper.instance().onChange(evt);
    expect(onChange).toHaveBeenCalledWith(evt.target.files[0]);
    expect(onBlur).toHaveBeenCalledWith(evt.target.files[0]);
  });

  it('should fire onChange and onBlur on clear', () => {
    wrapper.instance().clear();
    expect(onChange).toHaveBeenCalledWith(null);
    expect(onBlur).toHaveBeenCalledWith(null);
  });
});

