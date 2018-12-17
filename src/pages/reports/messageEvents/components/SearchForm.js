import React, { Fragment, Component } from 'react';
import { Button, Panel } from '@sparkpost/matchbox';
import { FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import styles from './AdvancedFilters.module.scss';
import EventTypeFilters from './EventTypeFilters';
import { getSearchQueriesFromFilters } from 'src/helpers/events';
import { selectEventsListing } from '../../../../selectors/eventListing';
import { getDocumentation, updateMessageEventsSearchOptions } from '../../../../actions/events';
import SearchQuery from './SearchQuery';

export class SearchForm extends Component {

  render() {
    const { handleSubmit, handleApply } = this.props;
    return (
      <Fragment>
        <form onSubmit={handleSubmit(handleApply)}>
          <Panel title='Advanced Filters'>
            <Panel.Section>
              <EventTypeFilters eventTypeDocs={this.props.eventListing}/>
            </Panel.Section>
            <Panel.Section>
              <FieldArray component={SearchQuery} name="searchQuery"/>
            </Panel.Section>
            <Panel.Section>
              <Button primary submit >Apply Filters</Button>
              <Button className={styles.Cancel} onClick={this.props.handleCancel}>Cancel</Button>
            </Panel.Section>
          </Panel>
        </form>
      </Fragment>
    );
  }
}

//Transforms an array of event types into an object with each existing event type as the key with a value of true.
function getBooleanEventsObject(events) {
  return (events.reduce((accumulator, event) => {
    accumulator[event] = true;
    return accumulator;
  }, {}));
}

const formName = 'EventsSearchForm';
const mapStateToProps = (state) => ({
  initialValues: {
    searchQuery: getSearchQueriesFromFilters(state.events.search),
    ...getBooleanEventsObject(state.events.search.events)
  },
  eventListing: selectEventsListing(state)
});

export default connect(mapStateToProps, { updateMessageEventsSearchOptions, getDocumentation })(reduxForm({ form: formName })(SearchForm));
