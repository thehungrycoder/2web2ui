import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm, change } from 'redux-form';
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
    cleanList: []
  }



  search = () => {
    const { types, sources } = this.state;
    const recipients = this.props.recipients;
    const suppressed = [];
    return this.props.searchSuppressions({ dateOptions: {}, subaccount: 0, types, sources}, recipients)
      .then((results) => {
        console.log('suppressions: ', results);
        _.map(recipients, (recip) => {
          _.map(results, (sup) => {
            if (recip.address.email.toLowerCase() === sup.recipient) {
              suppressed.push(recip);
            }
          });
        });

      }).then(() => {
        return this.props.showSuppressed(suppressed);
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

  cleanDuplicates = () => {
    const { cleanList } = this.state;
    const { recipients, id } = this.props;
    return this.props.updateRecipientList({id, recipients: cleanList });
  }

  cleanSuppressed = () => {
    const { suppressed } = this.props.suppressed;
    const { recipients, id, } = this.props.recipients;
    const emails = _.map(suppressed, (s) => {
      return { address: { email: s.recipient }};
    });
    const newList = _.differenceBy(recipients, emails, 'address.email');
    return this.props.updateRecipientList({ id, recipients: newList });
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
    const { duplicates, showDuplicateCalc } = this.state;
    const { showSupp, suppressed } = this.props;
    console.log(showSupp);
    console.log(suppressed);
    return (
      <Panel>
        <Panel.Section>
          <h2>Duplicates</h2>
          <p>Clear your list of duplicate entries.</p>
          <Button onClick={this.checkUnique}>
            Check Duplicates
          </Button>
        </Panel.Section>
        { showDuplicateCalc &&
          <Panel.Section>
            <p> There are {duplicates} duplicate entries that can be removed from this list </p>
            <Button onClick={this.cleanDuplicates} primary> Delete Duplicates </Button>
          </Panel.Section>
        }
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
        </Panel.Section>
        { showSupp &&
          (<Panel.Section>
           <p>There are {suppressed.length} suppressed entries in the list.</p>
           <Button primary onClick={this.cleanSuppressed}>Delete Suppressed</Button>
         </Panel.Section>)
        }
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
  suppressed: state.suppressions.suppressed,
  showSupp: state.suppressions.showSuppressed,
  id: state.recipientLists.current.id,
  loading: state.suppressions.listLoading,
  initialValues: selectSearchInitialValues(state)
});


export default connect(mapStateToProps, suppressionActions)(reduxForm(formOptions)(SuppressionSearch));
