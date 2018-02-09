import React from 'react';
import { shallow } from 'enzyme';
import DownloadCodes from '../DownloadCodes';

describe('DownloadCodes component', () => {
  it('should render download button', () => {
    const props = {
      codes: ['code1', 'code2']
    };

    expect(shallow(<DownloadCodes {...props} />)).toMatchSnapshot();
  });
});
