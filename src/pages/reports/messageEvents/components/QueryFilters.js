import React, { Fragment, Component } from 'react';
import { Grid, Button } from '@sparkpost/matchbox';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { EVENTS_SEARCH_FILTERS } from 'src/constants';
import { TextFieldWrapper, SelectWrapper } from '../../../../components';
import { getFormSyncErrors } from 'redux-form';
import styles from './AdvancedFilters.module.scss';
import { AddCircleOutline, RemoveCircleOutline } from '@sparkpost/matchbox-icons';
import { required } from '../../../../helpers/validation';
import { getSearchQueriesFromFilters } from 'src/helpers/events';


const EVENTS_SELECTOR = [{ disabled: true, value: '', label: 'Select a Filter' },
  ... EVENTS_SEARCH_FILTERS,
  { hidden: true, value: '', label: '_______________' }];//This is just so the dropdown stays at the same length. TODO CSS?

export class QueryFilters extends Component {

  componentDidUpdate(prevProps) {
    const { clickedApply: prevClick } = prevProps;
    const { clickedApply: currentClick, touch, errors: { searchQuery: searchQueryErrors }} = this.props;

    //If the apply button has been pressed, show errors on Fields that have not been touched
    if (prevClick !== currentClick && searchQueryErrors) {
      for (let i = 0; i < searchQueryErrors.length; i++) {
        Object.keys(searchQueryErrors[i] || {}).forEach((item) => touch(`searchQuery[${i}].${item}`));
      }
    }
  }

  //Returns options array only containing those not selected yet and the currently selected option.
  getAvailableOptions = (filters, index) => {
    const used = filters.map((item) => item.key);
    return EVENTS_SELECTOR.filter((searchParameter) => !used.includes(searchParameter.value) || searchParameter.value === filters[index].key);
  }


  renderMembers = ({ fields }) =>
    (
      <Fragment>
        <Button color="blue" flat onClick={() => fields.push({})}> Add Filter <AddCircleOutline/></Button>
        {fields.map((member, index) => (
          <Grid key={index}>
            <Grid.Column
              className = {styles.SmallText}
              xs={12}
              md={2}
              lg={2}
            >
              <Field
                name={`${member}.key`}
                component={SelectWrapper}
                options={this.getAvailableOptions(fields.getAll(), index)}
                validate={required}
              />
            </Grid.Column>
            <Grid.Column
              xs={12}
              md={6}
              lg={6}
            >
              <Field
                name={`${member}.value`}
                type="text"
                component={TextFieldWrapper}
                validate={required}
              />
            </Grid.Column>
            <Grid.Column
              xs={12}
              md={3}
              lg={3}
            >
              <p>
                <Button color="red" flat onClick={() => fields.remove(index)}>Remove <RemoveCircleOutline/></Button>
              </p>
            </Grid.Column>
          </Grid>
        ))}
      </Fragment >
    );

  render() {
    return (
      <FieldArray component={this.renderMembers} name="searchQuery"/>
    );
  }
}

const mapStateToProps = (state) => ({
  initialValues: {
    searchQuery: getSearchQueriesFromFilters(state.events.search)
  },
  errors: getFormSyncErrors('SearchQueryForm')(state)
});

const formOptions = {
  form: 'SearchQueryForm'
};

export default connect(mapStateToProps, null)(reduxForm(formOptions)(QueryFilters));
