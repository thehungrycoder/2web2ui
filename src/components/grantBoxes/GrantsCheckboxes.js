import classnames from 'classnames/bind';
import React from 'react';
import _ from 'lodash';
import { Field } from 'redux-form';
import { Grid, Tooltip } from '@sparkpost/matchbox';

import { CheckboxWrapper } from 'src/components/reduxFormWrappers';
import styles from './GrantsCheckboxes.module.scss';

const cx = classnames.bind(styles);

const GrantsCheckboxes = ({ grants, show }) => {
  const grantFields = _.map(grants, (grant) => (
    <div className={styles.Grant} key={grant.key}>
      <Tooltip dark content={grant.description}>
        <Field
          name={`grants[${grant.key}]`}
          label={grant.label}
          component={CheckboxWrapper}
          type="checkbox"
        />
      </Tooltip>
    </div>
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
