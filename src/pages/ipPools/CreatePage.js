import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Loading, Page, Panel } from '@sparkpost/matchbox';
import PoolForm from './components/PoolForm';

import { showAlert } from 'src/actions/globalAlert';
import { createPool } from 'src/actions/ipPools';


const breadcrumbAction = {
  content: 'IP Pools',
  Component: Link,
  to: '/account/ip-pools'
};

export class CreatePage extends React.Component {
  createPool = (values) => {
    const { createPool, showAlert, history } = this.props;

    return createPool(values).then((res) => {
      showAlert({
        type: 'success',
        message: `Created IP pool ${values.name}.`
      });
      history.push('/account/ip-pools');
    }).catch((err) => showAlert({
      type: 'error',
      message: 'Unable to create IP pool. Please try again!'
    }));
  };

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <Page title="Create IP Pool" breadcrumbAction={breadcrumbAction}>
        <Panel>
          <Panel.Section>
            <PoolForm onSubmit={this.createPool} isNew={true} />
          </Panel.Section>
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({});

export default connect(mapStateToProps, {
  createPool,
  showAlert
})(CreatePage);
