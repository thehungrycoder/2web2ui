import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';

import { createPool } from 'src/actions/ipPools';
import Layout from 'src/components/layout/Layout';
import PoolForm from './PoolForm';

const breadcrumbAction = {
  content: 'IP Pools',
  Component: Link,
  to: '/account/ip-pools'
};

export class CreatePage extends React.Component {
  onSubmit = (values) => {
    const { createPool, history } = this.props;

    return createPool(values).then((res) => {
      history.push('/account/ip-pools');
    });
  };

  render() {
    return (
      <Layout.App loading={this.props.loading}>
        <Page title="Create IP Pool" breadcrumbAction={breadcrumbAction} />
        <Panel>
          <Panel.Section>
            <PoolForm onSubmit={this.onSubmit} isNew={true} />
          </Panel.Section>
        </Panel>
      </Layout.App>
    );
  }
}

const mapStateToProps = (state, props) => ({});

export default connect(mapStateToProps, { createPool })(CreatePage);
