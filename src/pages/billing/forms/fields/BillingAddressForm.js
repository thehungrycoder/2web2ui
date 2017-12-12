import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector, change } from 'redux-form';
import PropTypes from 'prop-types';

import { Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper, SelectWrapper } from 'src/components';
import { required } from 'src/helpers/validation';
import { getZipLabel } from 'src/helpers/billing';

import styles from './Fields.module.scss';
import _ from 'lodash';

/**
 * This component will register the following redux-form fields
 * billingAddress.firstName
 * billingAddress.lastName
 * billingAddress.country
 * billingAddress.state (if country US | CA)
 * billingAddress.zip
 */
export class BillingAddressForm extends Component {
  state = {
    showName: true
  }

  handleCountryChange = (e) => {
    const value = e.target.value;

    // Removes state value from store
    if (value !== 'US' && value !== 'CA') {
      this.props.change(this.props.formName, 'billingAddress.state', null);
    }
  }

  componentDidMount() {
    const { firstName, lastName } = this.props;

    // Hide name fields if we already have them
    // Their values are still in the redux-form store although the fields are hidden
    if (firstName && lastName) {
      this.setState({ showName: false });
    }
  }

  render() {
    const { countries = [], countryValue, disabled } = this.props;

    const stateOrProvince = countries.length && (countryValue === 'US' || countryValue === 'CA')
      ? <Grid.Column xs={6}>
        <Field
          label={countryValue === 'US' ? 'State' : 'Province'}
          name='billingAddress.state'
          placeholder={`Select a ${countryValue === 'US' ? 'State' : 'Province'}`}
          component={SelectWrapper}
          options={_.find(countries, { value: countryValue }).states}
          validate={required}
          disabled={disabled}
        />
      </Grid.Column>
      : null;

    const nameFields = this.state.showName
      ? <Grid className={styles.spacer}>
        <Grid.Column xs={6}>
          <Field
            label='First Name'
            name='billingAddress.firstName'
            component={TextFieldWrapper}
            validate={required}
            disabled={disabled}
          />
        </Grid.Column>
        <Grid.Column xs={6}>
          <Field
            label='Last Name'
            name='billingAddress.lastName'
            component={TextFieldWrapper}
            validate={required}
            disabled={disabled}
          />
        </Grid.Column>
      </Grid>
      : null;

    return (
      <div>
        <p><small>Billing Address</small></p>
        { nameFields }
        <Field
          label='Country'
          name='billingAddress.country'
          placeholder='Select a country'
          component={SelectWrapper}
          options={countries}
          validate={required}
          disabled={disabled}
          onChange={this.handleCountryChange}
        />
        <Grid>
          { stateOrProvince }
          <Grid.Column xs={6}>
            <Field
              label={getZipLabel(countryValue)}
              name='billingAddress.zip'
              component={TextFieldWrapper}
              validate={required}
              disabled={disabled}
            />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

BillingAddressForm.propTypes = {
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
    countryValue: selector(state, 'billingAddress.country'),
    firstName: selector(state, 'billingAddress.firstName'),
    lastName: selector(state, 'billingAddress.lastName')
  };
};
export default connect(mapStateToProps, { change })(BillingAddressForm);
