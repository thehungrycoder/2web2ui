import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import { UnstyledLink } from '@sparkpost/matchbox';
import { listPools } from 'src/actions/ipPools';
import { RadioGroup, SelectWrapper, TextFieldWrapper } from 'src/components';
import { required } from 'src/helpers/validation';
import { getNonDefaultIpPools } from 'src/selectors/ipPools';
import { LINKS } from 'src/constants';

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
    (ipPools.length > 0) && <Field
      component={RadioGroup}
      name='ipPool.action'
      options={options}
      validate={required}
    />
  );
};


const WarmUpHelpText = () => (
  <span>New dedicated IP addresses will need to be warmed up, so we require new IPs to be added to an isolated, non-default pool. Read our <UnstyledLink to={LINKS.IP_WARM_UP} external>IP Warm-up Overview</UnstyledLink> for more information.</span>
);

const ExistingIpPoolField = ({ disabled, ipPools }) => {
  const options = ipPools.map((p) => ({ label: p.name, value: p.id }));

  return (
    <Field
      disabled={disabled}
      name='ipPool.id'
      component={SelectWrapper}
      label='Choose an IP Pool'
      options={options}
      placeholder=' ' // needed for matchbox, treated same as empty string by redux-form
      required
      validate={required}
      helpText={<WarmUpHelpText />}
    />
  );
};

const NewIpPoolField = ({ disabled }) => (
  <Field
    disabled={disabled}
    name='ipPool.name'
    component={TextFieldWrapper}
    label='Name your new IP Pool'
    required
    validate={required}
    helpText={<WarmUpHelpText />}
  />
);

class IpPoolSelect extends Component {
  componentDidMount() {
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
