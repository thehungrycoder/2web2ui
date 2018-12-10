import React, { Fragment } from 'react';
import { TextField, Select, Grid, Button } from '@sparkpost/matchbox';
import { RemoveCircleOutline } from '@sparkpost/matchbox-icons';
import { EVENTS_SEARCH_FILTERS } from 'src/constants';
import styles from './AdvancedFilters.module.scss';

const TextFilters = ({ filterValues: { searchQueries = []}, onChange, onDelete, onSelect }) => (<Fragment >
  <div >
    {searchQueries.map(({ value, key, error }, index) => <Grid key={index}>
      <Grid.Column
        className = {styles.SmallText}
        xs={12}
        md={2}
        lg={2}
      >
        <Select
          id="id"
          options={EVENTS_SEARCH_FILTERS}
          onChange={(e) => onSelect(e, index)}
          value = {key}
        />
      </Grid.Column>
      <Grid.Column
        xs={12}
        md={6}
        lg={6}
      >
        <TextField
          id={index.toString()}
          value={value}
          error = {error}
          onChange={(e) => onChange(e, index)}
        />
      </Grid.Column>
      <Grid.Column
        xs={12}
        md={3}
        lg={3}
      >
        <p>
          <Button color="red" flat onClick={(e) => onDelete(e, index)}>Remove <RemoveCircleOutline/></Button>
        </p>
      </Grid.Column>
    </Grid>

    )}
  </div>
</Fragment>);

export default TextFilters;
