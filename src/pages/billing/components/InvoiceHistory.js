import React, { Fragment } from 'react';
import { Panel, Button } from '@sparkpost/matchbox';
import { Check, Close } from '@sparkpost/matchbox-icons';
import { TableCollection } from 'src/components';
import { formatDate } from 'src/helpers/date';

import styles from './InvoiceHistory.module.scss';

const columns = [
  { label: null, width: '18px' },
  'Date',
  'Amount',
  'Invoice Number',
  null
];

const getRowData = ({ status, date, amount, invoice_number: invoiceNumber }) => ([
  status === 'Posted'
    ? <Check className={styles.Posted} size={20} />
    : <Close className={styles.Error} size={20} />,
  formatDate(date),
  formatCurrency(amount),
  invoiceNumber,
  <div style={{ textAlign: 'right' }}><Button plain size='small'>Download</Button></div>
]);

const formatCurrency = (v) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const InvoiceHistory = ({ invoices }) => {
  // Perhaps need a "amounts shown in USD" message somewhere?

  const maxWarning = invoices.length === 20
    ? <Panel.Footer left={<p><small>Only your last 20 invoices are available to be viewed</small></p>} />
    : null;

  return (
    <Fragment>
      <Panel title='Invoice History'>
        <TableCollection rows={invoices} columns={columns} getRowData={getRowData} />
      </Panel>
      {maxWarning}
    </Fragment>
  );
};

// In case 'status' & 'invoiceNumber' don't work out
// <Collection rows={invoices} rowComponent={Invoice}/>
// const Invoice = ({ date, amount, invoiceNumber }) => (
//   <Panel.Section actions={[{ content: 'Download' }]}>//
//     <h6 style={{ marginBottom: 0 }}><strong>{formatCurrency(amount)}</strong></h6>
//     <small>{formatDate(date)}</small>
//   </Panel.Section>
// );

export default InvoiceHistory;
