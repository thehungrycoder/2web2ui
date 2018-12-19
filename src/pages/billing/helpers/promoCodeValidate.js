import { verifyPromoCode } from 'src/actions/billing';

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
    throw { promoCode: 'Invalid promo code' };
  });
}
