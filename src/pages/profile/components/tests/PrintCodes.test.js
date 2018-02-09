import React from 'react';
import { shallow } from 'enzyme';
import PrintCodes from '../PrintCodes';
import print from 'print-js';

jest.mock('print-js');

describe('PrintCodes Component', () => {
  let wrapper;
  const props = {
    codes: ['code1', 'code2']
  };

  beforeEach(() => {
    wrapper = shallow(<PrintCodes {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call print lib with proper formatted json', () => {
    wrapper.find('Button').simulate('click');
    expect(print).toHaveBeenCalledWith({
      printable: [
        { code: 'code1' },
        { code: 'code2' }
      ],
      properties: ['code'],
      type: 'json'
    });
  });

});
