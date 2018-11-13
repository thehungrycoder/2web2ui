import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';

import FileFieldWrapper from '../FileFieldWrapper';


cases('FileFieldWrapper', (props) => {
  const defaults = {
    fileType: 'csv',
    input: {},
    label: 'Test File Input',
    meta: {
      touched: false
    },
    required: true
  };
  const wrapper = shallow(<FileFieldWrapper {...defaults} {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders file input': {},
  'renders file input with no specified type': {
    fileType: undefined
  },
  'renders file input with selected filename': {
    input: {
      value: {
        name: 'test.csv',
        size: 999
      }
    }
  },
  'renders file input with multiple allowed file types': {
    fileType: undefined,
    fileTypes: ['.txt,.csv'],
    input: {
      value: {
        name: 'test.txt',
        size: 999
      }
    }
  },
  'renders disabled file input': {
    disabled: true
  },
  'renders file input with error message': {
    meta: {
      error: 'Oh no!',
      touched: true
    }
  },
  'renders file input with help message': {
    helpText: 'Ask Google!'
  },
  'renders with a hidden label': {
    labelHidden: true,
    required: true,
    label: 'a label'
  }
});

// This is ugly.  It would be better to test the behavior and not the implementation
it('FileFieldWrapper.handleCancel', () => {
  const props = {
    input: {
      onBlur: jest.fn()
    }
  };
  const instance = new FileFieldWrapper(props);

  instance.handleCancel();
  expect(props.input.onBlur).toHaveBeenCalled();
});

// This is ugly.  It would be better to test the behavior and not the implementation
it('FileFieldWrapper.handleDrop', () => {
  const props = {
    input: {
      onBlur: jest.fn(),
      onChange: jest.fn()
    }
  };
  const file = { name: 'test.csv' };
  const instance = new FileFieldWrapper(props);

  instance.handleDrop([file], []);

  expect(props.input.onChange).toHaveBeenCalledWith(file);
  expect(props.input.onBlur).toHaveBeenCalled();
});

// This is ugly.  It would be better to test the behavior and not the implementation
it('FileFieldWrapper.handleOpen', () => {
  const dropzone = {
    open: jest.fn()
  };
  const instance = new FileFieldWrapper({});
  instance.dropzoneRef = dropzone;

  instance.handleOpen();
  expect(dropzone.open).toHaveBeenCalled();
});
