import { verifyPromoCode } from 'src/actions/billing';
import { change } from 'redux-form';

export default function promoCodeValidate(values, dispatch) {
  const { promoCode, planpicker } = values;
  if (!promoCode) {
    return Promise.resolve();
  }

  return dispatch(
    verifyPromoCode({
      promoCode,
      billingId: planpicker.billingId,
      meta: { promoCode }
    })
  ).catch(({ message }) => {
    dispatch(change('changePlan', 'promoCode', ''));
    throw { promoCode: 'Invalid promo code' };
  });
}
