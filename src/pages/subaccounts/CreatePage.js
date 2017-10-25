import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';
import { Loading } from 'src/components';

import SubaccountForm from './components/SubaccountForm';

import { create as createSubaccount } from 'src/actions/subaccounts';
import { listSubaccountGrants } from 'src/actions/api-keys';
import { listPools } from 'src/actions/ipPools';

const breadcrumbAction = {
  content: 'Subaccounts',
  Component: Link,
  to: '/account/subaccounts'
};

export class CreatePage extends React.Component {
  componentDidMount() {
    this.props.listSubaccountGrants();
    this.props.listPools();
  }

  onSubmit = (values) => {
    const { createSubaccount, history } = this.props;

    return createSubaccount(values).then((res) => {
      // TODO: Direct to details page when built,
      //      details page needs to display the API Key if created here
      history.push('/account/subaccounts');
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
