import React from 'react';
import { CardSummary, PlanSummary, SummarySection} from '../SummarySection';
import { shallow } from 'enzyme';

describe('Summary Sections: ', () => {

  it('should render summary with a label and children', () => {
    const wrapper = shallow(<SummarySection label='omg'>hello</SummarySection>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render plan summary', () => {
    const plan = {
      monthly: 100,
      overage: 0.1,
      volume: 10
    }
    const wrapper = shallow(<PlanSummary plan={plan} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render card summary', () => {
    const billing = {
      credit_card: {
        type: 'visa',
        number: '---55555',
        expiration_year: 2025,
        expiration_month: 5
      }
    }
    const wrapper = shallow(<CardSummary billing={billing} />);
    expect(wrapper).toMatchSnapshot();
  });
});
