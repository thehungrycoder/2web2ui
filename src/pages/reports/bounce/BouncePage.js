import React, { Component } from 'react';
import { connect } from 'react-redux';

import { refresh } from 'src/actions/bounceReport';

import { Page, Panel } from '@sparkpost/matchbox';
import Filters from '../components/Filters';
import Header from './components/Header';
import ChartGroup from './components/ChartGroup';
import { Loading } from 'src/components';

class BouncePage extends Component {

  componentDidMount() {
    this.props.refresh();
  }

  handleRefresh = (options) => {
    this.props.refresh(options);
  }

  handleModalToggle = (modal) => {

  }

  render() {
    const { loading, aggregates, categories, types } = this.props;

    const pageContent = loading || !aggregates
      ? <Loading />
      : (
        <div>
        <Header aggregates={aggregates} />
          <Panel sectioned title='Bounce Categories'>
            <ChartGroup
              categories={categories}
              types={types}
              aggregates={aggregates} />
          </Panel>
        </div>
      );

    return (
      <Page title='Bounce Report'>
        <Filters refresh={this.handleRefresh} onShare={this.handleModalToggle('shareModal')} />
        { pageContent }
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.bounceReport.loading,
  filters: state.reportFilters,
  aggregates: state.bounceReport.aggregates,
  categories: state.bounceReport.categories,
  types: state.bounceReport.types
});
export default connect(mapStateToProps, { refresh })(BouncePage);
