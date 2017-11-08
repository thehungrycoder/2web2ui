import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Panel } from '@sparkpost/matchbox';
import PanelLoading from './PanelLoading';

import { getSubaccount, editSubaccount } from 'src/actions/subaccounts';
import { getSubaccount as getSubaccountSelector } from 'src/selectors/subaccounts';
import { showAlert } from 'src/actions/globalAlert';

import SubaccountEditForm from './SubaccountEditForm';

export class EditTab extends Component {

  onSubmit = ({ name, status, ipPool }) => {
    const { editSubaccount, subaccount, getSubaccount } = this.props;

    return editSubaccount(subaccount.id, { name, status, ip_pool: ipPool })
      .then(() => showAlert({ type: 'success', message: 'Updated subaccount' })
      .then(getSubaccount(subaccount.id,))
    ).catch((err) =>
      showAlert({ type: 'error', message: 'Error updating subaccount', details: err.message })
    );
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
  subaccount: getSubaccountSelector(state),
  ...props
});

export default withRouter(
  connect(mapStateToProps, { getSubaccount, editSubaccount })(EditTab)
);
