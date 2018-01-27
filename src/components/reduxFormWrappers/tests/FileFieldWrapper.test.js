import React from 'react';
import { shallow } from 'enzyme';

import FileFieldWrapper from '../FileFieldWrapper';

describe('FileFieldWrapper', () => {
  let wrapper;
  let props;

  function createProps(extraProps = {}) {
    return {
      id: 'uploadem',
      label: 'Upload them all here',
      name: 'uploadem',
      meta: { touched: false, error: false },
      input: { value: null, onChange: jest.fn(), onBlur: jest.fn() },
      ...extraProps
    };
  }

  function createWrapper(props) {
    return shallow(<FileFieldWrapper {...props} />);
  }

  describe('rendering', () => {
    beforeEach(() => {
      props = createProps();
      wrapper = createWrapper(props);
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render errors', () => {
      const errProps = {
        ...props,
        meta: { touched: true, error: 'One at a time please' }
      };
      expect(shallow(<FileFieldWrapper {...errProps} />)).toMatchSnapshot();
    });
  });

  describe('events', () => {
    let file;
    beforeEach(() => {
      file = { name: 'all-the-stuff.csv' };
      props = createProps();
      wrapper = createWrapper(props);
    });

    it('should render selected filename', () => {
      const fileProps = {
        input: { ...props.input, value: file }
      };
      props = createProps(fileProps);
      wrapper = createWrapper(props);
      expect(wrapper).toMatchSnapshot();
    });

    it('should fire props.onChange', () => {
      wrapper.instance().handleDrop([file]);
      expect(props.input.onChange).toHaveBeenCalled();
    });

    it('should not fire onChange if no valid files were dropped', () => {
      wrapper.instance().handleDrop([]);
      expect(props.input.onChange).not.toHaveBeenCalled();
    });
  });
});
