import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getBillingCountries } from 'src/actions/billing';
import PropTypes from 'prop-types';
import { SelectField } from 'src/components/formFields';
import { required } from 'src/helpers/validation';

export class CountryField extends Component {

  componentDidMount() {
    this.props.getBillingCountries();
  }

  render() {
    const { countries, ...rest } = this.props;
    return (
      <SelectField
        label='Country'
        placeholder='Select a country'
        placeholderValue=''
        options={countries}
        validate={required}
        {...rest}
      />
    );
  }
}

CountryField.defaultProps = {
  countries: []
};

CountryField.propTypes = {
  countries: PropTypes.array,
  name: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({ countries: state.billing.countries });
const mapDispatchToProps = { getBillingCountries };

export default connect(mapStateToProps, mapDispatchToProps)(CountryField);
