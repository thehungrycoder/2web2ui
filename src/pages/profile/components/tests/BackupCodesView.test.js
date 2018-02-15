import { shallow } from 'enzyme';
import React from 'react';
import BackupCodesView from '../BackupCodesView';

describe('Component: BackupCodes', () => {
  it('should render correctly', () => {
    const props = {
      codes: ['code1', 'code2', 'code3']
    };
    const wrapper = shallow(<BackupCodesView {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

});

