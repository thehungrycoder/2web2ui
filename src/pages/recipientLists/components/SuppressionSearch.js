import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm } from 'redux-form';
import { Grid, Button, Panel } from '@sparkpost/matchbox';
import { FilterDropdown } from 'src/components';
import * as suppressionActions from 'src/actions/suppressions';
import { selectSearchInitialValues } from 'src/selectors/suppressions';
import styles from './SuppressionSearch.module.scss';

import { TYPES, SOURCES, RELATIVE_DATE_OPTIONS } from '../constants';

export class SuppressionSearch extends Component {

  state = {
    sources: [],
    types: [],
    showDuplicateCalc: false,
    duplicates: 0,
    showSuppressed: false,
    suppressed: []
  }


  search = () => {
    const { types, sources } = this.state;
    const recipients = this.props.recipients;
    return this.props.searchSuppressions({ dateOptions: {}, subaccount: 0, types, sources }).then((results) => {
      console.log('suppressions: ', results);
      const suppressed = [];
      _.map(recipients, (recip) => {
        _.map(results, (sup) => {
          if (recip.address.email === sup.recipient) {
            suppressed.push(recip);
          }
        });
      })
      console.log('sup in list: ', suppressed);
      this.setState({ suppressed, showSuppressed: true });
    });
  }

  checkUnique = () => {
    const recipients = this.props.recipients;
    const deduped = _.uniqBy(recipients, 'address.email');
    const diff = recipients.length - deduped.length;
    if (diff) {
      this.setState({
        duplicates: diff,
        showDuplicateCalc: true,
        cleanList: deduped
      });
    }
  }

  // cleanDuplicates = () => {
  //   this.props.updateRecipientList()
  // }

  cleanSuppressed = () => {
    const { suppressed } = this.state;
    const { recipients, id } = this.props.recipients;
    const emails = _.map(suppressed, (s) => {
      return { address: { email: s.recipient }};
    });
    const newList = _.differenceBy(recipients, emails, 'address.email');

  }

  handleTypesSelection = (selected) => {
    const types = _.compact(_.map(selected, (val, key) => val ? key : undefined));
    // this.props.updateSuppressionSearchOptions({ types });
    this.setState({ types: types })
  }

  handleSourcesSelection = (selected) => {
    const sources = _.compact(_.map(selected, (val, key) => val ? key : undefined));
    // this.props.updateSuppressionSearchOptions({ sources });
    this.setState({ sources: sources })
  }



  render() {
    const { duplicates, showDuplicateCalc, showSuppressed, suppressed } = this.state;
    return (
      <Panel>
        <Panel.Section>
          <h2>Duplicates</h2>
          <p>Clear your list of duplicate entries.</p>
          <Button onClick={this.checkUnique}>
            Check Duplicates
          </Button>
          { showDuplicateCalc &&
            <div>
              <p> There are {duplicates} duplicate entries that can be removed from this list </p>
              <Button primary> Delete Duplicates </Button>
            </div>
          }

        </Panel.Section>
        <Panel.Section>
          <h2>Suppressions</h2>
          <p>Clear your list of suppressed entries</p>
          <Grid>
            <Grid.Column xs={6} md={3}>
              <div>
                <FilterDropdown
                  popoverClassName={styles.suppresionPopver} formName='filterForm' options={TYPES} namespace='types' displayValue='Type'
                  onClose={this.handleTypesSelection}
                />
              </div>
            </Grid.Column>

            <Grid.Column xs={6} md={3}>
              <div>
                <FilterDropdown
                  formName='filterForm' options={SOURCES} namespace='sources' displayValue='Sources'
                  popoverClassName={styles.fatPopover} onClose={this.handleSourcesSelection}
                />
              </div>
            </Grid.Column>
            <Grid.Column xs={6} md={3}>
              <div>
                <Button onClick={this.search}>
                  Check Suppressions
                </Button>
              </div>
            </Grid.Column>
          </Grid>
          { showSuppressed &&
            <div>
             <p>There are {suppressed.length} suppressed entries in the list.</p>
             <Button onClick={this.cleanSuppressed}>Delete Suppressed</Button>
            </div>
          }
        </Panel.Section>
      </Panel>
    );
  }
}

const formName = 'filterForm';
const formOptions = {
  form: formName
};

const mapStateToProps = (state) => ({
  search: state.suppressions.search,
  list: state.suppressions.list,
  recipients: state.recipientLists.current.recipients,
  id: state.recipientLists.current.id,
  loading: state.suppressions.listLoading,
  initialValues: selectSearchInitialValues(state)
});


export default connect(mapStateToProps, suppressionActions)(reduxForm(formOptions)(SuppressionSearch));
