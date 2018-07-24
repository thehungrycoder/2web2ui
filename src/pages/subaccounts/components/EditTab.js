import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Panel } from '@sparkpost/matchbox';
import PanelLoading from 'src/components/panelLoading/PanelLoading';

import { getSubaccount, editSubaccount } from 'src/actions/subaccounts';
import { selectSubaccount } from 'src/selectors/subaccounts';
import { showAlert } from 'src/actions/globalAlert';

import SubaccountEditForm from './SubaccountEditForm';

export class EditTab extends Component {

  onSubmit = ({ ipPool, name, restrictedToIpPool, status }) => {
    const { editSubaccount, subaccount, getSubaccount, showAlert } = this.props;
    const nextSubaccount = {
      name,
      status,
      ip_pool: restrictedToIpPool ? ipPool : '' // must pass an empty string to unset
    };

    return editSubaccount(subaccount.id, nextSubaccount).then(() => {
      showAlert({ type: 'success', message: 'Updated subaccount' });
      getSubaccount(subaccount.id);
    });
  };

  render() {
    if (this.props.loading) {
      return (
        <PanelLoading />
      );
    }

    return (
      <Panel>
        <SubaccountEditForm subaccount={this.props.subaccount} onSubmit={this.onSubmit}/>
      </Panel>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.ipPools.listLoading,
  subaccount: selectSubaccount(state),
  ...props
});

export default withRouter(
  connect(mapStateToProps, { getSubaccount, editSubaccount, showAlert })(EditTab)
);
