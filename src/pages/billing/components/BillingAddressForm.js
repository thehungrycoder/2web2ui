import React from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';

import { Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper, SelectWrapper } from 'components';
import { required } from 'helpers/validation';
import { getZipLabel } from 'helpers/billing';

import styles from './Forms.module.scss';
import _ from 'lodash';

/**
 * This component will register the following redux-form fields
 * billingAddress.firstName
 * billingAddress.lastName
 * billingAddress.country
 * billingAddress.streetAddress
 * billingAddress.state (if country US | CA)
 * billingAddress.zip
 */
const BillingAddressForm = ({ countries, countryValue }) => {
  const stateOrProvince = countryValue === 'US' || countryValue === 'CA'
    ? <Grid.Column xs={6}>
        <Field
          label={countryValue === 'US' ? 'State' : 'Province'}
          name='billingAddress.state'
          component={SelectWrapper}
          options={_.find(countries, { value: countryValue }).states}
          validate={required}
        />
      </Grid.Column>
    : null;

  return (
    <div>
      <p><small>Billing Address</small></p>
      <Grid className={styles.spacer}>
        <Grid.Column xs={6}>
          <Field
            label='First Name'
            name='billingAddress.firstName'
            component={TextFieldWrapper}
            validate={required}
          />
        </Grid.Column>
        <Grid.Column xs={6}>
          <Field
            label='Last Name'
            name='billingAddress.lastName'
            component={TextFieldWrapper}
            validate={required}
          />
        </Grid.Column>
      </Grid>
      <Field
        label='Country'
        name='billingAddress.country'
        placeholder='Select a country'
        component={SelectWrapper}
        options={countries}
        validate={required}
      />
      <Field
        label='Street Address'
        name='billingAddress.streetAddress'
        component={TextFieldWrapper}
        validate={required}
      />
      <Grid>
        { stateOrProvince }
        <Grid.Column xs={6}>
          <Field
            label={getZipLabel(countryValue)}
            name='billingAddress.zip'
            component={TextFieldWrapper}
            validate={required}
          />
        </Grid.Column>
      </Grid>
    </div>
  );
};

BillingAddressForm.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  countryValue: PropTypes.string,
  formName: PropTypes.string.isRequired
};

// Get country value from state
const mapStateToProps = (state, { formName }) => {
  const selector = formValueSelector(formName);
  return {
    countryValue: selector(state, 'billingAddress.country')
  };
};
export default connect(mapStateToProps, null)(BillingAddressForm);
