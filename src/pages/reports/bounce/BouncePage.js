import React, { Component } from 'react';
import { connect } from 'react-redux';

import { refresh } from 'src/actions/bounceReport';

import { Page, Panel } from '@sparkpost/matchbox';
import Filters from '../components/Filters';
import ChartGroup from './components/ChartGroup';

export class BouncePage extends Component {
  componentDidMount() {
    this.props.refresh();
  }

  handleRefresh = (options) => {
    this.props.refresh(options);
  }

  handleModalToggle = (modal) => {
    // TODO
  }

  render() {
    const { loading, aggregates } = this.props;

    const pageContent = !loading && aggregates && aggregates.countBounce === 0
      ? <Panel sectioned><h6>No bounces to report.</h6></Panel> // TODO
      : <ChartGroup />;

    return (
      <Page title='Bounce Report'>
        <Filters refresh={this.handleRefresh} onShare={this.handleModalToggle('shareModal')} />
        { pageContent }
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.bounceReport.aggregatesLoading || state.bounceReport.categoriesLoading,
  aggregates: state.bounceReport.aggregates
});
export default connect(mapStateToProps, { refresh })(BouncePage);
