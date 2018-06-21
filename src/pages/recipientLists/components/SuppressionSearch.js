import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm, change } from 'redux-form';
import { Grid, Button, Panel } from '@sparkpost/matchbox';
import { FilterDropdown } from 'src/components';
import * as suppressionActions from 'src/actions/suppressions';
import { selectSearchInitialValues } from 'src/selectors/suppressions';
import styles from './SuppressionSearch.module.scss';
import { showAlert } from '../../../actions/globalAlert';

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
    this.setState({
      duplicates: diff,
      showDuplicateCalc: true,
      cleanList: deduped
    });

  }

  cleanDuplicates = () => {
    const { cleanList } = this.state;
    const { current } = this.props;
    const newList = _.map(cleanList, (recipient) => {
      if (!recipient.return_path) {
        return _.omit(recipient, ['return_path']);
      } else {
        return recipient;
      }
    });

    current.recipients = newList;
    return this.props.updateRecipientList(current)
      .then(() => this.props.getRecipientList(current.id))
      .then(() => {
        this.props.showAlert({
          type: 'success',
          message: `Duplicate recipients have been removed from this list`
        });
      });
  }

  cleanSuppressed = () => {
    const { recipients, current, suppressed } = this.props;
    const newList = _.differenceBy(recipients, suppressed, 'address.email');
    const actualList = _.map(newList, (recipient) => {
      if (!recipient.return_path) {
        return _.omit(recipient, ['return_path']);
      } else {
        return recipient;
      }
    });
    current.recipients = actualList;
    console.log(actualList.length);
    // return this.props.updateRecipientList(current)
    //   .then(() => this.props.getRecipientList(current.id))
    //   .then(() => {
    //     this.props.showAlert({
    //       type: 'success',
    //       message: `${suppressed.length} recipients have been removed from this list`
    //     });
    //   });;

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
            { duplicates &&
              <Button onClick={this.cleanDuplicates} primary> Delete Duplicates </Button>
            }
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
           { !!suppressed.length &&
             <Button primary onClick={this.cleanSuppressed}>Delete Suppressed</Button>
           }
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
  current: state.recipientLists.current,
  recipients: state.recipientLists.current.recipients,
  suppressed: state.suppressions.suppressed,
  showSupp: state.suppressions.showSuppressed,
  id: state.recipientLists.current.id,
  loading: state.suppressions.listLoading,
  initialValues: selectSearchInitialValues(state)
});


export default connect(mapStateToProps, {...suppressionActions, showAlert})(reduxForm(formOptions)(SuppressionSearch));
