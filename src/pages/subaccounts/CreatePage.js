import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';

// import { createSubaccount } from 'src/actions/subaccounts';
import Layout from 'src/components/layout/Layout';
import SubaccountForm from './components/SubaccountForm';

const breadcrumbAction = {
  content: 'Subaccounts',
  Component: Link,
  to: '/account/subaccounts'
};

export class CreatePage extends React.Component {
  // onSubmit = (values) => {
  //   const { createSubaccount, history } = this.props;
  //
  //   return createSubaccount(values).then((res) => {
  //     history.push('/account/subaccounts');
  //   });
  // };

  render() {
    return (
      <Layout.App>
        <Page title="Create Subaccount" breadcrumbAction={breadcrumbAction} />
        <Panel>
          <SubaccountForm />
        </Panel>
      </Layout.App>
    );
  }
}

const mapStateToProps = (state, props) => ({ });

export default withRouter(
  connect(mapStateToProps, {})(CreatePage)
);
