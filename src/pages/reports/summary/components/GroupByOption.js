import React, { Component } from 'react';
import styles from './Table.module.scss';
import { connect } from 'react-redux';

import { Checkbox, Grid, Select } from '@sparkpost/matchbox';
import { _getTableData } from 'src/actions/summaryChart';
import { hasSubaccounts } from 'src/selectors/subaccounts';

import _ from 'lodash';
import { GROUP_CONFIG } from './tableConfig';


export class GroupByOption extends Component {

  state = {
    topDomainsOnly: true
  }

  handleGroupChange = (e) => {
    this.props._getTableData({ groupBy: e.target.value });
  }

  handleDomainsCheckboxChange = () => {
    const topDomainsOnly = !this.state.topDomainsOnly;
    this.setState({ topDomainsOnly });
    const groupBy = topDomainsOnly ? 'watched-domain' : 'domain';
    this.props._getTableData({ groupBy });
  }

  getSelectOptions = () => {
    const domainOmittedGroup = this.state.topDomainsOnly ? _.omit(GROUP_CONFIG, 'domain') : _.omit(GROUP_CONFIG, 'watched-domain');
    const options = _.keys(domainOmittedGroup).map((key) => ({
      value: key,
      label: domainOmittedGroup[key].label
    }));

    if (!this.props.hasSubaccounts) {
      _.remove(options, { value: 'subaccount' });
    }

    return options;
  }

  renderDomainsCheckbox() {
    const { tableLoading, groupBy } = this.props;
    const { topDomainsOnly } = this.state;

    //Only show 'Top Domains Only' checkbox when on the recipient domains grouping
    if (!(groupBy === 'watched-domain' || groupBy === 'domain')) {
      return null;
    }
    return (
      <div className={styles.TopDomainsCheckbox}>
        <Checkbox
          id="watchedDomains"
          label="Top Domains Only"
          checked={topDomainsOnly}
          onChange={this.handleDomainsCheckboxChange}
          disabled={tableLoading}
        />
      </div>
    );
  }

  render() {
    return (
      <Grid>
        <Grid.Column xs={12} md={5} lg={4}>
          <Select
            label='Group By'
            options={this.getSelectOptions()}
            value={this.props.groupBy}
            disabled={this.props.tableLoading}
            onChange={this.handleGroupChange}/>
        </Grid.Column>
        <Grid.Column xs={12} md={4} mdOffset={3} lg={3} lgOffset={5}>
          {this.renderDomainsCheckbox()}
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  hasSubaccounts: hasSubaccounts(state),
  ...state.summaryChart
});
export default connect(mapStateToProps, { _getTableData })(GroupByOption);
