import React, { Fragment } from 'react';
import { Button, Grid } from '@sparkpost/matchbox';
import { AddCircleOutline, HighlightOff } from '@sparkpost/matchbox-icons';
import styles from './SearchForm.module.scss';
import { Field } from 'redux-form';
import { getFiltersAsArray } from '../helpers/transformData.js';
import { SelectWrapper, TextFieldWrapper } from 'src/components/reduxFormWrappers';
import { required, eventsQuery } from 'src/helpers/validation';
import { EVENTS_SEARCH_FILTERS } from 'src/constants';
import _ from 'lodash';

const EVENTS_SELECTOR = [{ disabled: true, value: '', label: 'Select a Filter' },
  ... getFiltersAsArray(EVENTS_SEARCH_FILTERS)];

const makeQueryValidator = _.memoize((filter) => () => eventsQuery(filter));

//Returns options array only containing those not selected yet and the currently selected option.
const getAvailableOptions = (filters, index) => {
  const used = filters.map((item) => item.key);
  return EVENTS_SELECTOR.filter((searchParameter) => !used.includes(searchParameter.value) || searchParameter.value === filters[index].key);
};

const getPlaceholderText = _.memoize((key) => {
  if (!key) {
    return 'Select Filter Type';
  }
  return EVENTS_SEARCH_FILTERS[key].placeholder;
});

export default ({ fields }) => (
  <Fragment>
    <Button className = {styles.AddButton} color="blue" flat onClick={() => fields.push({})}> Add Filter<AddCircleOutline className = {styles.Icon}/></Button>
    {fields.map((member, index) => (
      <Grid key={index}>
        <Grid.Column
          xs={3}
          md={3}
          lg={3}
        >
          <div className={styles.Selector}>
            <Field
              name={`${member}.key`}
              component={SelectWrapper}
              options={getAvailableOptions(fields.getAll(), index)}
              validate={required}
            />
          </div>
        </Grid.Column>
        <Grid.Column
          xs={12}
          md={12}
          lg={7}
        >
          <Field
            name={`${member}.value`}
            type="text"
            placeholder = {getPlaceholderText(fields.get(index).key)}
            component={TextFieldWrapper}
            validate = {makeQueryValidator(fields.get(index))}
          />
        </Grid.Column>
        <Grid.Column
          xs={12}
          md={12}
          lg={2}
        >
          <p>
            <Button color="red" flat onClick={() => fields.remove(index)}>Remove< HighlightOff className = {styles.Icon}/></Button>
          </p>
        </Grid.Column>
      </Grid>
    ))}
  </Fragment >
);
