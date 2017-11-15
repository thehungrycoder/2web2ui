import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';

import { listPools } from 'src/actions/ipPools';
import { RadioGroup, SelectWrapper, TextFieldWrapper } from 'src/components';
import { required } from 'src/helpers/validation';
import { getNonDefaultIpPools } from 'src/selectors/ipPools';

const EXISTING = 'existing';
const NEW = 'new';

const ActionSelect = ({ disabled, ipPools, loading }) => {
  const options = [
    {
      disabled,
      label: 'Assign to a new IP Pool',
      value: NEW
    },
    { // Disable option until IP pools are loaded and have at least
      disabled: disabled || loading || ipPools.length === 0,
      label: 'Assign to an existing IP Pool',
      value: EXISTING
    }
  ];

  return (
    <Field
      component={RadioGroup}
      name='ipPool.action'
      options={options}
      validate={required}
    />
  );
};

const ExistingIpPoolField = ({ disabled, ipPools }) => {
  const options = ipPools.map((p) => ({ label: p.name, value: p.id }));

  return (
    <Field
      disabled={disabled}
      name='ipPool.id'
      component={SelectWrapper}
      label='Choose an IP Pool'
      options={options}
      placeholder=' '  // needed for matchbox, treated same as empty string by redux-form
      validate={required}
    />
  );
};

const NewIpPoolField = ({ disabled }) => (
  <Field
    disabled={disabled}
    name='ipPool.name'
    component={TextFieldWrapper}
    label='Name your new IP Pool'
    validate={required}
  />
);

class IpPoolSelect extends Component {
  componentWillMount() {
    this.props.listPools();
  }

  render() {
    const { action } = this.props;

    return (
      <div>
        <ActionSelect {...this.props} />
        { action === EXISTING && <ExistingIpPoolField { ...this.props } /> }
        { action === NEW && <NewIpPoolField { ...this.props } /> }
      </div>
    );
  }
}

const mapStateToProps = (state, { formName }) => {
  const selector = formValueSelector(formName);

  return {
    action: selector(state, 'ipPool.action'),
    ipPools: getNonDefaultIpPools(state),
    loading: state.ipPools.listLoading
  };
};

export default connect(mapStateToProps, { listPools })(IpPoolSelect);
