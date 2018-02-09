import { shallow } from 'enzyme';
import React from 'react';
import BackupCodesList from '../BackupCodesList';

describe('Component: BackupCodesList', () => {
  it('should render correctly', () => {
    const props = {
      codes: ['code1', 'code2', 'code3']
    };
    const wrapper = shallow(<BackupCodesList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

});

