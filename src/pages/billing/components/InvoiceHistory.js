import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Button } from '@sparkpost/matchbox';
import { TableCollection } from 'src/components';
import { formatDate } from 'src/helpers/date';
import { get as getInvoice } from 'src/actions/invoices';
import { showAlert } from 'src/actions/globalAlert';


const columns = [
  'Date',
  'Amount',
  'Invoice Number',
  null
];


const formatCurrency = (v) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export class InvoiceHistory extends Component {
  state = {
    invoiceNumber: null
  };

  getRowData = ({ date, amount, invoice_number: invoiceNumber, id }) => {
    const { invoiceLoading, invoiceId } = this.props;
    const thisInvoiceLoading = (invoiceId === id);
    return ([
      formatDate(date),
      formatCurrency(amount),
      invoiceNumber,
      <div style={{ textAlign: 'right' }}>
        <Button plain size='small' type='submit' disabled={invoiceLoading}
          onClick={() => this.getInvoice(id, invoiceNumber)}>
          {thisInvoiceLoading ? 'Downloading...' : 'Download'}
        </Button>
      </div>
    ]);
  }
  ;

  getInvoice = (id, invoiceNumber) => {
    this.setState({ invoiceNumber });
    this.props.getInvoice(id);
  };

  componentDidUpdate (prevProps) {
    const { invoice, listError, getError, showAlert } = this.props;
    const { invoiceNumber } = this.state;

    if (listError) {
      showAlert({ type: 'error', message: 'Error getting invoices' });
    }

    if (getError) {
      showAlert({ type: 'error', message: 'Error downloading invoice' });
    }

    if (!prevProps.invoice && invoice) {
      const url = URL.createObjectURL(invoice);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sparkpost-invoice-${invoiceNumber}.pdf`);
      link.click();

      showAlert({ type: 'success', message: `Downloaded invoice: ${invoiceNumber}` });

    }

  }

  render () {
    const { invoices } = this.props;

    // Perhaps need a "amounts shown in USD" message somewhere?
    //
    const hasInvoices = (invoices && invoices.length > 0);

    const maxWarning = invoices.length === 20
      ? <Panel.Footer left={<p><small>Only your last 20 invoices are available to be viewed</small></p>} />
      : null;

    return (
      <Fragment>
        <Panel title='Invoice History' sectioned={!hasInvoices}>
          {
            hasInvoices
              ? <TableCollection rows={invoices} columns={columns} getRowData={this.getRowData}/>
              : 'You don\'t have any invoices'
          }
        </Panel>
        {maxWarning}
      </Fragment>
    );

  }

}

const mapStateToProps = (state) => ({
  invoices: state.invoices.list,
  invoice: state.invoices.invoice,
  invoiceLoading: state.invoices.invoiceLoading,
  invoiceId: state.invoices.invoiceId
});

export default connect(mapStateToProps, { getInvoice, showAlert })(InvoiceHistory);
