import React, { Component } from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/Layout/Layout';
import UsageReport from '../../components/UsageReport/UsageReport';
import { Panel } from '@sparkpost/matchbox';
import TutorialItem from './components/TutorialItem';

export class DashboardPage extends Component {
  render () {
    const tutorialMarkup = tutorial.map((item) => <Panel.Section><TutorialItem {...item} /></Panel.Section>);
    return (
      <Layout.App>
        <h1>Dashboard</h1>

        <UsageReport />

        <Panel title='Getting Started'>
          { tutorialMarkup }
        </Panel>
      </Layout.App>
    );
  }
}

const tutorial = [
  {
    label: 'Veriy your email address',
    helpText: 'Check your email to verify your email address and increase your daily sending limits',
    completed: true // does nothing yet
  },
  {
    label: 'Add a sending domain',
    labelLink: 'settings/profile',
    helpText: 'Add a sending domain to send email from your own domain'
  },
  {
    label: 'Verify your sending domain',
    labelLink: 'settings/profile',
    helpText: 'You\'ll need to verify your domain before you can use it'
  },
  {
    label: 'Create a bounce domain',
    labelLink: 'settings/profile',
    helpText: 'You\'ll need to verify your domain before you can use it'
  },
  {
    label: 'Create an API key',
    labelLink: 'settings/profile',
    helpText: 'You\'ll need to create an API key to use our API or SMTP integration.'
  }
];

export default connect(({ account, currentUser }) => ({ account, currentUser }))(DashboardPage);
