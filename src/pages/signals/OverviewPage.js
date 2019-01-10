import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { list as getSubaccounts } from 'src/actions/subaccounts';
import { selectSubaccountsById } from 'src/selectors/subaccounts';
import Page from './components/SignalsPage';
import EngagementRecencyOverview from './containers/EngagementRecencyOverviewContainer';
import HealthScoreOverview from './containers/HealthScoreOverviewContainer';
import SpamTrapOverview from './containers/SpamTrapOverviewContainer';
import FacetFilter from './components/filters/FacetFilter';
import DateFilter from './components/filters/DateFilter';
import SubaccountFilter from './components/filters/SubaccountFilter';

export class OverviewPage extends Component {
  componentDidMount() {
    this.props.getSubaccounts();
  }

  render() {
    const { subaccounts } = this.props;

    return (
      <Page
        title='Signals Overview'
        primaryArea={
          <Fragment>
            <SubaccountFilter />
            <DateFilter />
            <FacetFilter />
          </Fragment>
        }
      >
        <HealthScoreOverview subaccounts={subaccounts} />
        <SpamTrapOverview subaccounts={subaccounts} />
        <EngagementRecencyOverview subaccounts={subaccounts} />
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => ({
  subaccounts: selectSubaccountsById(state)
});

const mapDispatchToProps = {
  getSubaccounts
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewPage);
