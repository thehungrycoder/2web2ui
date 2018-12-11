import React from 'react';
import { TextFieldWrapper } from 'src/components';
import { Field } from 'redux-form';
import styles from './PromoCode.module.scss';
import { connect } from 'react-redux';

class PromoCode extends React.Component {

  handleBlur = (e, value) => {
    // const { onBlur } = this.props;
    //TODO: perform verification
    // onBlur({ promoCode: value });
  }

  render() {
    const { selectedPromo = {}, promoError } = this.props;
    return (
      <span>
        <Field
          label='Promo Code'
          name="promoCode"
          errorInLabel
          validate={(value) => promoError}
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

const mapStateToProps = (state, props) => {
  const { billing } = state;
  return {
    selectedPromo: billing.selectedPromo,
    promoError: billing.promoError
  };
};

export default connect(mapStateToProps)(PromoCode);
