import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Panel, Tooltip } from '@sparkpost/matchbox';
import { InfoOutline } from '@sparkpost/matchbox-icons';
import { LabelledValue, Unit } from 'src/components';
import _ from 'lodash';

import styles from './View.module.scss';

const PercentOrSample = ({ variant }) => {
  if (variant.sample_size) {
    return <LabelledValue label='Sample Size'><p>{variant.sample_size.toLocaleString()}</p></LabelledValue>;
  }

  if (variant.percent) {
    return <LabelledValue label='Percent'><p><Unit unit='percent' value={variant.percent}/></p></LabelledValue>;
  }

  return null;
};

const Engagement = ({ variant }) => {
  if (!variant.engagement_rate) {
    return null;
  }

  let metricMarkup = null;

  if (variant.count_unique_confirmed_opened) {
    metricMarkup = <span>{variant.count_unique_confirmed_opened.toLocaleString()} opens of {variant.count_accepted.toLocaleString()} accepted</span>;
  }

  if (variant.count_unique_clicked) {
    metricMarkup = <span>{variant.count_unique_clicked.toLocaleString()} clicks of {variant.count_accepted.toLocaleString()} accepted</span>;
  }

  return (
    <Panel.Section>
      <LabelledValue label='Engagement'>
        <h6>
          <Tooltip dark content={metricMarkup}>
            <Unit unit='percent' value={variant.engagement_rate}/>
            {' '}
            <span className={styles.InfoIcon}><InfoOutline /></span>
          </Tooltip>
        </h6>
      </LabelledValue>
    </Panel.Section>
  );
};

const Variant = ({ variant = {}, title, link }) => (
  <Panel>
    <Panel.Section actions={[{
      content: 'View Template',
      color: 'orange',
      component: Link,
      // BUG: No `setSubaccountQuery(subaccountId)` here
      // Impossible to know if the template is assigned to a subaccount or not because duplicate template IDs are allowed
      // eg { id: 'temp', shared_with_all: true } vs. { id: 'temp', subaccount_id: 101 }
      //    both are usable from the same ab test
      to: `/templates/edit/${variant.template_id}/published`
    }]}>
      {title && <h6 className={styles.SmallHeader}>{title}</h6>}
      <LabelledValue label='Template ID'><h6>{variant.template_id}</h6></LabelledValue>
      <PercentOrSample variant={variant} />
    </Panel.Section>
    <Engagement variant={variant} />
  </Panel>
);

const VariantsView = ({ test }) => (
  <Fragment>
    <Variant variant={test.default_template} title='Default Template' />
    {_.map(test.variants, (variant, i) => <Variant variant={variant} key={i}/>)}
  </Fragment>
);

export default VariantsView;
