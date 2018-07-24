import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Actions
import { createAbTestDraft } from 'src/actions/abTesting';
import { showAlert } from 'src/actions/globalAlert';

// Components
import { Page, Panel } from '@sparkpost/matchbox';
import AbTestForm from './components/AbTestForm';

export class CreatePage extends Component {

  create = (values) => {
    const { createAbTestDraft, showAlert } = this.props;
    const { id, name, default_template_id } = values;
    const default_template = { template_id: default_template_id };
    const abTest = { id, name, default_template };

    // TODO: we have no way to assign subaccount ids right now...
    // return createAbTestDraft({ abTest, subaccount: subaccountId })
    return createAbTestDraft({ abTest, subaccount: 0 })
      .then(() => showAlert({ type: 'success', message: 'A/B test created' }));
    // showAlert({ type: 'success', message: 'A/B test created' });
  }

  // TODO: Learn more link needs linked
  render() {
    return (
      <Page breadcrumbAction={{ content: 'Back to A/B Tests', component: Link, to: '/ab-testing' }}>
        <Panel
          title='Create a New A/B Test'
          actions={[{ content: 'Learn more about A/B tests', color: 'orange' }]}
        >
          <AbTestForm newAbTest={true} onSubmit={this.create}/>
        </Panel>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    abTest: state.abTesting.abTest
  };
}

export default connect(mapStateToProps, { createAbTestDraft, showAlert })(CreatePage);
