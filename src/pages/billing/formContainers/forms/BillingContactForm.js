import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import { Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { required, email } from 'src/helpers/validation';

import styles from './Forms.module.scss';

/**
 * This component will register the following redux-form fields
 * TODO only first 3 are show till we know requirements?
 * billingContact.email
 * billingContact.firstName
 * billingContact.lastName
 * billingContact.country
 * billingContact.streetAddress
 * billingContact.city
 * billingContact.state (if country US | CA)
 * billingContact.zip
 */
//const BillingContactForm = ({ countries, countryValue }) => {
const BillingContactForm = () =>
  // const stateOrProvince = countryValue === 'US' || countryValue === 'CA'
  //   ? <Grid.Column xs={6}>
  //       <Field
  //         label={countryValue === 'US' ? 'State' : 'Province'}
  //         name='billingContact.state'
  //         component={SelectWrapper}
  //         options={_.find(countries, { value: countryValue }).states}
  //         validate={required}
  //       />
  //     </Grid.Column>
  //   : null;

   (
    <div>
      <Grid className={styles.spacer}>
        <Grid.Column xs={6}>
          <Field
            label='First Name'
            name='billingContact.firstName'
            component={TextFieldWrapper}
            validate={required}
          />
        </Grid.Column>
        <Grid.Column xs={6}>
          <Field
            label='Last Name'
            name='billingContact.lastName'
            component={TextFieldWrapper}
            validate={required}
          />
        </Grid.Column>
      </Grid>
      <Field
        label='Email'
        name='billingContact.email'
        component={TextFieldWrapper}
        validate={[required, email]}
      />

      {/* <Field
        label='Country'
        name='billingContact.country'
        placeholder='Select a country'
        component={SelectWrapper}
        options={countries}
        validate={required}
      />
      <Field
        label='Street Address'
        name='billingContact.streetAddress'
        component={TextFieldWrapper}
        validate={required}
      />
      <Grid>
        { stateOrProvince }
        <Grid.Column xs={6}>
          <Field
            label={getZipLabel(countryValue)}
            name='billingContact.zip'
            component={TextFieldWrapper}
            validate={required}
          />
        </Grid.Column>
      </Grid> */}
    </div>
  );

BillingContactForm.propTypes = {
  // countries: PropTypes.arrayOf(PropTypes.shape({
  //   value: PropTypes.string.isRequired,
  //   label: PropTypes.string.isRequired
  // })),
  // countryValue: PropTypes.string,
  formName: PropTypes.string.isRequired
};

// Get country value from state
const mapStateToProps = (state, { formName }) =>
  // const selector = formValueSelector(formName);
   ({
    // countryValue: selector(state, 'billingContact.country')
   });
export default connect(mapStateToProps, null)(BillingContactForm);
