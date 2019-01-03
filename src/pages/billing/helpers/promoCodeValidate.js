import { verifyPromoCode } from 'src/actions/billing';
import { change } from 'redux-form';

const promoCodeValidate = (formName) => (values, dispatch, props, field) => {
  const { promoCode, planpicker } = values;
  if (!promoCode) {
    return Promise.resolve();
  }

  if (field === 'planpicker') {
    dispatch(change(formName, 'promoCode', ''));
    return Promise.resolve();
  }

  return dispatch(
    verifyPromoCode({
      promoCode,
      billingId: planpicker.billingId,
      meta: { promoCode }
    })
  ).catch(() => {
    dispatch(change(formName, 'promoCode', ''));
    throw { promoCode: 'Invalid promo code' };
  });
};

export default promoCodeValidate;
