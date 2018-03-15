import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';
import { Loading } from 'src/components';

import SubaccountCreateForm from './components/SubaccountCreateForm';

import { create as createSubaccount } from 'src/actions/subaccounts';
import { listSubaccountGrants } from 'src/actions/api-keys';
import { listPools } from 'src/actions/ipPools';
import { showAlert } from 'src/actions/globalAlert';

const breadcrumbAction = {
  content: 'Subaccounts',
  Component: Link,
  to: '/account/subaccounts'
};

export class CreatePage extends Component {
  componentDidMount() {
    this.props.listSubaccountGrants();
    this.props.listPools();
  }

  onSubmit = (values) => {
    const { createSubaccount, history, showAlert } = this.props;

    return createSubaccount(values).then(({ subaccount_id }) => {
      showAlert({ type: 'success', message: `Subaccount ${subaccount_id} created` });
      history.push(`/account/subaccounts/${subaccount_id}`);
    });
  };

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <div>
        <Page title="Create Subaccount" breadcrumbAction={breadcrumbAction} />
        <Panel>
          <SubaccountCreateForm onSubmit={this.onSubmit}/>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.apiKeys.subaccountGrantsLoading || state.ipPools.listLoading
});

export default withRouter(
  connect(mapStateToProps, { listSubaccountGrants, listPools, createSubaccount, showAlert })(CreatePage)
);
