import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import CountryField from './CountryField';
import StateProvinceField from './StateProvinceField';
import { Grid } from '@sparkpost/matchbox';
import { TextField } from 'src/components/formFields';
import { required, email } from 'src/helpers/validation';
import { getZipLabel } from 'src/helpers/billing';
import styles from './Fields.module.scss';

export function BillingContactFields(props) {
  return (
    <React.Fragment>
      <pre><code>
        {JSON.stringify(props.currentValues, null, 2)}
      </code></pre>
      <Grid className={styles.spacer}>
        <Grid.Column xs={6}>
          <TextField
            label='First Name'
            name='firstName'
            validate={required}
          />
        </Grid.Column>
        <Grid.Column xs={6}>
          <TextField
            label='Last Name'
            name='lastName'
            validate={required}
          />
        </Grid.Column>
      </Grid>
      <TextField
        label='Email'
        name='email'
        validate={[required, email]}
      />
      <CountryField
        name='country'
        onChange={() => props.change('state', '')}
      />
      <Grid>
        <StateProvinceField
          name='state'
          selectedCountryCode={props.currentValues.country}
          wrapper={({ children }) => <Grid.Column xs={6}>{children}</Grid.Column>}
        />
        <Grid.Column xs={6}>
          <TextField
            label={getZipLabel(props.currentValues.country)}
            name='zip'
            validate={required}
          />
        </Grid.Column>
      </Grid>
    </React.Fragment>
  );
}

BillingContactFields.propTypes = {
  currentValues: PropTypes.object,
  formName: PropTypes.string.isRequired,
  change: PropTypes.func.isRequired
};

// Get country value from state
const mapStateToProps = (state, { formName }) => ({
  currentValues: formValueSelector(formName)(state)
});
export default connect(mapStateToProps)(BillingContactFields);
