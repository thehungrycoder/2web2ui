import React from 'react';
import { shallow } from 'enzyme';
import Typeahead from '../Typeahead';

jest.mock('src/helpers/sortMatch', () => ([]));

describe('Component: Typeahead', () => {

  it('should render ok by default', () => {
    const props = {
      items: [],
      onSelect: jest.fn(),
      placeholder: 'a placeholder'
    };
    shallow(<Typeahead {...props} />);
    // expect(wrapper).toMatchSnapshot();

    // NOTE: cannot run this snapshot test until we upgrade to Jest 22.
    // See: https://github.com/paypal/downshift/issues/216#issuecomment-359047556

    // Upgrading from 21 to 22 caused 56 snapshot test failures because of the
    // change from Function to MockFunction in snapshot rendering, so I'm waiting
    // to do that upgrade in a separate branch

  });

});
