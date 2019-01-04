import React, { Component } from 'react';
import { Button, Panel } from '@sparkpost/matchbox';
import { FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import styles from './SearchForm.module.scss';
import { FORMS } from 'src/constants';
import EventTypeFilters from './EventTypeFilters';
import { getSearchQueriesFromFilters, getBooleanEventsObject } from '../helpers/transformData.js';
import { selectMessageEventListing } from 'src/selectors/eventListing';
import { getDocumentation, updateMessageEventsSearchOptions } from 'src/actions/messageEvents';
import SearchQuery from './SearchQuery';

export class SearchForm extends Component {

  render() {
    const { handleSubmit, handleApply, handleCancel, eventListing } = this.props;
    return (
      <form onSubmit={handleSubmit(handleApply)}>
        <Panel title='Advanced Filters'>
          <Panel.Section>
            <EventTypeFilters eventTypeDocs={eventListing}/>
          </Panel.Section>
          <Panel.Section>
            <FieldArray component={SearchQuery} name="searchQuery"/>
          </Panel.Section>
          <Panel.Section>
            <Button primary submit >Apply Filters</Button>
            <Button className={styles.Cancel} onClick={handleCancel}>Cancel</Button>
          </Panel.Section>
        </Panel>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  initialValues: {
    searchQuery: getSearchQueriesFromFilters(state.messageEvents.search),
    ...getBooleanEventsObject(state.messageEvents.search.events)
  },
  eventListing: selectMessageEventListing(state)
});

export default connect(mapStateToProps, { updateMessageEventsSearchOptions, getDocumentation })(reduxForm({ form: FORMS.EVENTS_SEARCH,
  touchOnChange: true })(SearchForm));
