import React from 'react';
import { TextFieldWrapper } from 'src/components';
import { Field } from 'redux-form';
import styles from './PromoCode.module.scss';
import { LoadingSVG } from 'src/components';
import { connect } from 'react-redux';
import _ from 'lodash';

const Loading = ({ loading }) => loading ? <LoadingSVG size="XSmall" /> : null;

export class PromoCode extends React.Component {

  render() {
    const { selectedPromo = {}, promoPending = false } = this.props;
    return (
      <span>
        <Field
          label='Promo Code'
          name="promoCode"
          errorInLabel
          component={TextFieldWrapper}
          suffix={<Loading loading={promoPending} />}
        />
        {!_.isEmpty(selectedPromo) && (
          <span className={styles.CurrentPromoLabel}>{selectedPromo.description || 'Promo code applied!'}</span>
        )}
      </span>
    );
  }
}

const mapStateToProps = (state) => ({
  promoPending: state.billing.promoPending
});

export default connect(mapStateToProps)(PromoCode);
