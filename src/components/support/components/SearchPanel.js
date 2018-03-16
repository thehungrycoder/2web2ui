import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Panel, TextField } from '@sparkpost/matchbox';
import { getAlgoliaResults } from 'src/selectors/support';
import { algoliaSearch } from 'src/actions/support';
import AlgoliaResults from './AlgoliaResults';
import styles from './SupportForm.module.scss';

export class SearchPanel extends Component {
  state = {
    searchParams: ''
  };

  componentDidMount() {
    // firing off a request to return "top" results
    this.props.algoliaSearch('');
  }

  searchAlgolia = (event) => {
    const { algoliaSearch } = this.props;
    this.setState({ searchParams: event.currentTarget.value });
    algoliaSearch(this.state.searchParams);
  };

  renderForm() {
    const { searchParams } = this.state;
    const { results, toggleForm } = this.props;

    return <div>
      <Panel.Section>
        <TextField
          onChange={this.searchAlgolia}
          value={searchParams}
          placeholder={'Have a Question?  Ask or enter a search term here.'}
        />
      </Panel.Section>
      <Panel.Section className={styles.Results}>
        <AlgoliaResults results={results} />
      </Panel.Section>
      <Panel.Section>
        <span className={styles.helpText}>Do you need more assistance?</span>
        <Button primary onClick={toggleForm} className={styles.ToggleButton}>
          Submit a Ticket
        </Button>
      </Panel.Section>
    </div>;
  }

  render() {
    return this.renderForm();
  }
}

const mapStateToProps = (state) => ({
  results: getAlgoliaResults(state)
});

export default connect(mapStateToProps, { algoliaSearch })(SearchPanel);

