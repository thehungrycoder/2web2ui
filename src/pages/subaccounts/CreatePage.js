import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';
import { Loading } from 'src/components';

import SubaccountForm from './components/SubaccountForm';

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
    const { createSubaccount, history } = this.props;

    return createSubaccount(values).then((res) => {
      history.push(`/account/subaccounts/${res.subaccount_id}`);
    }).catch((err) => showAlert({ type: 'error', message: 'Could not create Subaccount', details: err.message }));
  };

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <div>
        <Page title="Create Subaccount" breadcrumbAction={breadcrumbAction} />
        <Panel>
          <SubaccountForm onSubmit={this.onSubmit}/>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.apiKeys.subaccountGrantsLoading || state.ipPools.listLoading
});

export default withRouter(
  connect(mapStateToProps, { listSubaccountGrants, listPools, createSubaccount })(CreatePage)
);
