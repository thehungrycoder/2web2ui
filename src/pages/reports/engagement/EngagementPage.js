import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Page, Panel } from '@sparkpost/matchbox';
import EngagementChart from './components/EngagementChart';

export class EngagementPage extends Component {
  render() {
    // Sample data
    const data = [
      { name: 'Targeted', value: 1000 },
      { name: 'Accepted', value: 500 },
      { name: 'Unique Confirmed Opens', value: 100 },
      { name: 'Unique Clicks', value: 1 }
    ];

    return (
      <Page title='Engagement Report'>
        <Panel sectioned>
          <EngagementChart data={data} />
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({});
const mapDispatchToProps = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EngagementPage));
