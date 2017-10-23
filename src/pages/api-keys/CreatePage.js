import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { createApiKey } from 'src/actions/api-keys';
import { getLoading } from 'src/selectors/api-keys';
import ApiKeyForm from './components/ApiKeyForm';
import { Page, Panel } from '@sparkpost/matchbox';
import { Loading } from 'src/components';

const breadcrumbAction = {
  content: 'API Keys',
  Component: Link,
  to: '/account/api-keys'
};

export class CreatePage extends React.Component {
  onSubmit = (values) => {
    const { createApiKey, history } = this.props;

    return createApiKey(values).then((res) => {
      history.push('/account/api-keys');
    });
  };

  render() {

    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <div>
        <Page title="Create API Key" breadcrumbAction={breadcrumbAction} />
        <Panel>
          <Panel.Section>
            <ApiKeyForm onSubmit={this.onSubmit} />
          </Panel.Section>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: getLoading(state)
});

export default withRouter(
  connect(mapStateToProps, { createApiKey })(CreatePage)
);
