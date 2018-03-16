import React from 'react';
import { shallow } from 'enzyme';
import CardSummary from '../CardSummary';

describe('Component: CardSummary', () => {

  it('should render correctly', () => {
    const props = {
      label: 'A Label',
      billing: {
        credit_card: {
          type: 'Visa',
          number: '12345678',
          expiration_month: '04',
          expiration_year: 2022
        }
      }
    };
    expect(shallow(<CardSummary {...props} />)).toMatchSnapshot();
  });

});
