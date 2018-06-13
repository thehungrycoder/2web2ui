import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SelectField } from 'src/components/formFields';
import { required } from 'src/helpers/validation';

export function StateProvinceField({
  countries,
  selectedCountryCode,
  wrapper: Wrapper,
  ...rest
}) {

  const country = _.find(countries, { value: selectedCountryCode }) || {};
  const states = country.states;

  if (!states) {
    return null;
  }

  const stateLabel = selectedCountryCode === 'US' ? 'State' : 'Province';

  return (
    <Wrapper>
      <SelectField
        label={stateLabel}
        placeholder={`Select a ${stateLabel}`}
        placeholderValue=''
        options={states}
        validate={required}
        {...rest}
      />
    </Wrapper>
  );
}

StateProvinceField.defaultProps = {
  countries: [],
  selectedCountryCode: '',
  wrapper: React.Fragment
};

StateProvinceField.propTypes = {
  countries: PropTypes.array,
  selectedCountryCode: PropTypes.string,
  wrapper: PropTypes.node
};

const mapStateToProps = (state) => ({ countries: state.billing.countries });
export default connect(mapStateToProps)(StateProvinceField);
