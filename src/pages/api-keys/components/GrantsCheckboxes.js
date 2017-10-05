import classnames from 'classnames/bind';
import React from 'react';
import _ from 'lodash';
import { Field } from 'redux-form';
import { Grid } from '@sparkpost/matchbox';

import { CheckboxWrapper } from 'src/components/reduxFormWrappers';
import styles from './GrantsCheckboxes.module.scss';

const cx = classnames.bind(styles);

const GrantsCheckboxes = ({ grants, show }) => {
  const grantFields = _.map(grants, (grant) => (
    // TODO wrap me in a tooltip
    <Field
      key={grant.key}
      name={`grants[${grant.key}]`}
      label={grant.label}
      component={CheckboxWrapper}
      type="checkbox"
      normalize={(value) => (value ? 'true' : '')} // TODO is this necessary? otherwise we get proptype warnings
    />
  ));

  const grantFieldChunks = _.chunk(grantFields, Math.ceil(_.size(grants) / 3));

  const grantCols = _.map(grantFieldChunks, (grantFields, i) => (
    <Grid.Column xs={12} md={4} key={i}>
      {grantFields}
    </Grid.Column>
  ));

  const gridClasses = cx('Grants', { show });

  return <Grid className={gridClasses}>{grantCols}</Grid>;
};

export default GrantsCheckboxes;
