import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Button } from '@sparkpost/matchbox';
import { TableCollection } from 'src/components';
import { formatDate } from 'src/helpers/date';
import { get as getInvoice } from 'src/actions/invoices';
import { showAlert } from 'src/actions/globalAlert';
import _ from 'lodash';
import { formatCurrency } from 'src/helpers/units';


const columns = [
  'Date',
  'Amount',
  'Invoice Number',
  { label: null, width: 150 }
];

export class InvoiceHistory extends Component {

  getRowData = ({ invoice_date: invoiceDate, amount, invoice_number: invoiceNumber, id }) => {
    const { invoiceLoading, invoiceId } = this.props;
    const thisInvoiceLoading = (invoiceId === id);
    return ([
      formatDate(invoiceDate),
      formatCurrency(amount),
      invoiceNumber,
      <div style={{ textAlign: 'right' }}>
        <Button plain size='small' color='orange' disabled={invoiceLoading}
          onClick={() => this.props.getInvoice(id)}>
          {(invoiceLoading && thisInvoiceLoading) ? 'Downloading...' : 'Download'}
        </Button>
      </div>
    ]);
  };

  componentDidUpdate(prevProps) {
    const { invoice } = this.props;

    if (!prevProps.invoice && invoice) {
      this.downloadInvoice();
    }

  }

  downloadInvoice = () => {
    const { invoice, showAlert, invoices, invoiceId } = this.props;
    const invoiceNumber = _.find(invoices, { id: invoiceId }).invoice_number;
    const url = URL.createObjectURL(invoice);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `sparkpost-invoice-${invoiceNumber}.pdf`);

    // Firefox requires the link be added to the DOM before it can be .click()'d
    document.body.appendChild(link);
    link.click();

    // Need to make sure we wait for the next event loop to be sure the link click finishes
    // before we remove the link from the DOM and revoke the object URL
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 0);

    showAlert({ type: 'success', message: `Downloaded invoice: ${invoiceNumber}` });
  };

  render() {
    const { invoices } = this.props;

    const maxWarning = invoices.length >= 20
      ? <Panel.Footer left={<p><small>Only your last 20 invoices are available to be viewed</small></p>} />
      : null;

    return (
      <Fragment>
        <Panel title='Invoice History'>
          <TableCollection rows={invoices} columns={columns} getRowData={this.getRowData}/>
        </Panel>
        {maxWarning}
      </Fragment>
    );

  }

}

const mapStateToProps = (state) => ({
  invoice: state.invoices.invoice,
  invoiceLoading: state.invoices.invoiceLoading,
  invoiceId: state.invoices.invoiceId
});

export default connect(mapStateToProps, { getInvoice, showAlert })(InvoiceHistory);
