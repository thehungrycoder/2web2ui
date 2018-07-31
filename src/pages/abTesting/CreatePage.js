import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LINKS } from 'src/constants';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

// Actions
import { createAbTestDraft } from 'src/actions/abTesting';
import { showAlert } from 'src/actions/globalAlert';

// Components
import { Page, Panel } from '@sparkpost/matchbox';
import AbTestCreateForm from './components/AbTestCreateForm';

export class CreatePage extends Component {

  create = (values) => {
    const { createAbTestDraft, showAlert, history } = this.props;
    const { id, name, subaccount, default_variant = {}} = values;
    const subaccountId = subaccount ? subaccount.id : 0;
    const default_template = { template_id: default_variant.id };
    const abTest = { id, name, default_template };

    return createAbTestDraft({ abTest, subaccount: subaccountId })
      .then(() => {
        showAlert({ type: 'success', message: 'A/B test created' });
        history.push(`/ab-testing/${abTest.id}/1${setSubaccountQuery(subaccountId)}`);
      });
  }

  render() {
    return (
      <Page breadcrumbAction={{ content: 'Back to A/B Tests', component: Link, to: '/ab-testing' }}>
        <Panel
          title='Create a New A/B Test'
          actions={[{ content: 'Learn more about A/B tests', color: 'orange', to: LINKS.AB_TESTING_API, external: true }]}
        >
          <AbTestCreateForm onSubmit={this.create}/>
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
