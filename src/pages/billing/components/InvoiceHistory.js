import React, { Fragment } from 'react';
import { Panel } from '@sparkpost/matchbox';
import { Collection } from 'src/components';
import { formatDate } from 'src/helpers/date';
import _ from 'lodash';

const data = _.fill(Array(20), { date: new Date(), amount: 9123.333 });

const InvoiceHistory = ({ invoices = data }) => {
  const maxWarning = invoices.length === 20
    ? <Panel.Footer left={<p><small>Only your last 20 invoices are available to be viewed</small></p>} />
    : null;

  return (
    <Fragment>
      <Panel title='Invoice History'>
        <Collection rows={invoices} rowComponent={Invoice}/>
      </Panel>
      {maxWarning}
    </Fragment>
  );
};

const formatCurrency = (v) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Invoice = ({ date, amount }) => (
  <Panel.Section actions={[{ content: 'Download' }]}>
    {/*
      this looks okay too? ¯\_(ツ)_/¯ <LabelledValue label={formatDate(date)} value={<Fragment>${amount.toLocaleString()}</Fragment>} />
    */}
    <h6 style={{ marginBottom: 0 }}><strong>{formatCurrency(amount)}</strong></h6>
    <small>{formatDate(date)}</small>
  </Panel.Section>
);

export default InvoiceHistory;
