import { shallow } from 'enzyme';
import React from 'react';
import BackupCodes from '../BackupCodes';

describe('Component: BackupCodes', () => {
  it('should render correctly', () => {
    const props = {
      codes: ['code1', 'code2', 'code3']
    };
    const wrapper = shallow(<BackupCodes {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

});

