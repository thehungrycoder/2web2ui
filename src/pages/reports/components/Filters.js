import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addFilter, removeFilter } from 'src/actions/reportFilters';

import { Grid, Button, Panel, Tag } from '@sparkpost/matchbox';
import Typeahead from './Typeahead';

import DateFilter from './DateFilter';
import typeaheadCacheSelector from 'src/selectors/reportFilterTypeaheadCache';
import styles from './Filters.module.scss';

class Filters extends Component {
  renderActiveFilters = () => {
    const { filters } = this.props;
    return filters.activeList.length
      ? <Panel.Section>
        <small>Filters:</small>
        { filters.activeList.map((item, index) => <Tag key={index} onRemove={() => this.handleFilterRemove(index)} className={styles.TagWrapper}>{ item.type }: { item.value }</Tag>)}
      </Panel.Section>
      : null;
  }

  handleFilterRemove = (index) => {
    this.props.removeFilter(index);
    this.props.refresh();
  }

  handleTypeaheadSelect = (item) => {
    this.props.addFilter(item);
    this.props.refresh();
  }

  render() {
    const { typeaheadCache, refresh, filters, onShare } = this.props;

    return (
      <Panel>
        <Panel.Section >
          <Grid>
            <Grid.Column xs={12} md={6}>
              <div className={styles.FieldWrapper}>
                <DateFilter refresh={refresh} />
              </div>
            </Grid.Column>
            <Grid.Column xs={8} md={4} xl={5}>
              <Typeahead
                placeholder='Filter by domain, campaign, etc'
                onSelect={this.handleTypeaheadSelect}
                items={typeaheadCache}
                selected={filters.activeList}
              />
            </Grid.Column>
            <Grid.Column xs={4} md={2} xl={1}>
              <Button fullWidth onClick={onShare}>Share</Button>
            </Grid.Column>
          </Grid>
        </Panel.Section>
        { this.renderActiveFilters() }
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  filters: state.reportFilters,
  typeaheadCache: typeaheadCacheSelector(state)
});
export default connect(mapStateToProps, { addFilter, removeFilter })(Filters);
