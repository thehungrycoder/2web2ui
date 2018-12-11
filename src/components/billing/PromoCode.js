import React from 'react';
import { TextFieldWrapper } from 'src/components';
import { Field } from 'redux-form';
import styles from './PromoCode.module.scss';

class PromoCode extends React.Component {

  handleBlur = (e, value) => {
    const { onBlur } = this.props;
    onBlur(value);
  }

  render() {
    const { selectedPromo = {}, promoError = {}} = this.props;
    return (
      <span>
        <Field
          label='Promo Code'
          name="promoCode"
          errorInLabel
          validate={(value) => promoError.message}
          onBlur={this.handleBlur}
          component={TextFieldWrapper}
        />
        {selectedPromo && (
          <span className={styles.CurrentPromoLabel}>{selectedPromo.description}</span>
        )}
      </span>
    );
  }
}

export default PromoCode;
