import React from 'react';
import { shallow } from 'enzyme';
import { PromoCode } from '../PromoCode';

describe('promoCode', () => {
  let wrapper;

  let props;

  beforeEach(() => {
    props = {
      selectedPromo: {},
      promoPending: false
    };
    wrapper = shallow(<PromoCode {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with description', () => {
    props.selectedPromo.description = 'Promo code description';
    wrapper.setProps(props);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with loading spinner', () => {
    props.promoPending = true;
    wrapper.setProps(props);
    expect(wrapper).toMatchSnapshot();
  });
});
