import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { createApiKey, listGrants, listSubaccountGrants } from 'src/actions/api-keys';
import { showAlert } from 'src/actions/globalAlert';
import { getFormLoading } from 'src/selectors/api-keys';
import { hasSubaccounts } from 'src/selectors/subaccounts';

import ApiKeyForm from './components/ApiKeyForm';
import { Page, Panel } from '@sparkpost/matchbox';
import { Loading } from 'src/components';

const breadcrumbAction = {
  content: 'API Keys',
  Component: Link,
  to: '/account/api-keys'
};

export class CreatePage extends React.Component {
  componentDidMount() {
    this.props.listGrants();
    if (this.props.hasSubaccounts) {
      this.props.listSubaccountGrants();
    }
  }

  onSubmit = (values) => {
    const { createApiKey, history, showAlert } = this.props;

    return createApiKey(values).then((res) => {
      showAlert({ type: 'success', message: 'API key created' });
      history.push('/account/api-keys');
    });
  };

  render() {

    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <Page title="Create API Key" breadcrumbAction={breadcrumbAction}>
        <Panel>
          <ApiKeyForm onSubmit={this.onSubmit} />
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: getFormLoading(state),
  hasSubaccounts: hasSubaccounts(state)
});

export default withRouter(
  connect(mapStateToProps, { createApiKey, listGrants, listSubaccountGrants, showAlert })(CreatePage)
);
