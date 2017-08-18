import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addFilter, removeFilter, searchFilter } from 'actions/reportFilters';

import { Grid, Button, Panel, Tag } from '@sparkpost/matchbox';

import DateFilter from './DateFilter';
import Typeahead from './Typeahead';

import styles from './Filters.module.scss';

class Filters extends Component {
  handleTypeahead = () => {
    this.props.searchFilter();
  }

  renderActiveFilters = () => {
    const { filter } = this.props;
    return filter.activeList.length
      ? <Panel.Section>
          <small>Filters:</small>
          { filter.activeList.map((item, index) => <Tag key={index} onRemove={() => this.handleFilterRemove(index)} className={styles.TagWrapper}>{ item.value }</Tag>)}
        </Panel.Section>
      : null;
  }

  handleTypeaheadSelect = (index) => {
    this.props.addFilter(this.props.filter.searchList[index]);
  }

  handleFilterRemove = (index) => {
    this.props.removeFilter(index);
  }

  render () {
    const { filter, refresh } = this.props;

    return (
      <Panel>
        <Panel.Section >
          <Grid>
            <Grid.Column xs={12} md={6}>
              <div className={styles.FieldWrapper}>
                <DateFilter refresh={refresh} />
              </div>
            </Grid.Column>
            <Grid.Column xs={12} md={5}>
              <div className={styles.FieldWrapper}>
                <Typeahead
                  placeholder='Filter by domain'
                  onChange={this.handleTypeahead}
                  onSelect={this.handleTypeaheadSelect}
                  options={filter.searchList} />
              </div>
            </Grid.Column>
            <Grid.Column xs={12} md={1}>
              <Button fullWidth>Share</Button>
            </Grid.Column>
          </Grid>
        </Panel.Section>
        { this.renderActiveFilters() }
      </Panel>
    );
  }
}

const mapStateToProps = ({ reportFilters }) => ({ filter: reportFilters });
export default connect(mapStateToProps, { addFilter, removeFilter, searchFilter })(Filters);
