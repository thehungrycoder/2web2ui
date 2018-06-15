import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector, change } from 'redux-form';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper, SelectWrapper } from 'src/components';
import { required, email } from 'src/helpers/validation';
import { getZipLabel } from 'src/helpers/billing';
import styles from './Fields.module.scss';

/**
 * This component will register the following redux-form fields
 * billingContact.email
 * billingContact.firstName
 * billingContact.lastName
 * billingContact.country
 * billingContact.state (if country US | CA)
 * billingContact.zip
 */
export class BillingContactForm extends Component {
  handleCountryChange = (e) => {
    const value = e.target.value;

    // Removes state value from store
    if (value !== 'US' && value !== 'CA') {
      this.props.change(this.props.formName, 'billingContact.state', null);
    }
  }

  render() {
    const { countries = [], countryValue } = this.props;

    const stateOrProvince = countries.length && (countryValue === 'US' || countryValue === 'CA')
      ? <Grid.Column xs={6}>
        <Field
          label={countryValue === 'US' ? 'State' : 'Province'}
          name='billingContact.state'
          component={SelectWrapper}
          options={_.find(countries, { value: countryValue }).states}
          validate={required}
        />
      </Grid.Column>
      : null;

    return (
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

        <Field
          label='Country'
          name='billingContact.country'
          placeholder='Select a country'
          component={SelectWrapper}
          onChange={this.handleCountryChange}
          options={countries}
          validate={required}
        />
        <Grid>
          {stateOrProvince}
          <Grid.Column xs={6}>
            <Field
              label={getZipLabel(countryValue)}
              name='billingContact.zip'
              component={TextFieldWrapper}
              validate={required}
            />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

BillingContactForm.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })),
  countryValue: PropTypes.string,
  formName: PropTypes.string.isRequired
};

// Get country value from state
const mapStateToProps = (state, { formName }) => {
  const selector = formValueSelector(formName);
  return {
    countryValue: selector(state, 'billingContact.country')
  };
};
export default connect(mapStateToProps, { change })(BillingContactForm);
