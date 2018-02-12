import React from 'react';
import { shallow } from 'enzyme';

import StatusTooltipHeader from '../StatusTooltipHeader';

describe('StatusTooltipHeader component', () => {
  it('renders', () => {
    expect(shallow(<StatusTooltipHeader />)).toMatchSnapshot();
  });

});
