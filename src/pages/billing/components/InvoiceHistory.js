import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Button } from '@sparkpost/matchbox';
import { TableCollection } from 'src/components';
import { formatDate } from 'src/helpers/date';
import { get as getInvoice, list as getInvoices } from 'src/actions/invoices';


const columns = [
  'Date',
  'Amount',
  'Invoice Number',
  null
];


const formatCurrency = (v) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export class InvoiceHistory extends Component {
  state = {
    id: null
  };

  componentDidMount () {
    this.props.getInvoices();
  }

  getRowData = ({ status, date, amount, invoice_number: invoiceNumber, id }) => {
    const { invoiceLoading } = this.props;
    const thisInvoiceLoading = (id === this.state.invoiceId);
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
    this.setState({ invoiceNumber, invoiceId: id });
    this.props.getInvoice(id);
  };

  componentDidUpdate (prevProps) {
    const { invoice } = this.props;
    const { invoiceNumber } = this.state;

    //maybe set invoiceId back to null here

    if (!prevProps.invoice && invoice) {
      this.setState({ invoiceId: null });
      const url = URL.createObjectURL(invoice);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sparkpost-invoice-${invoiceNumber}.pdf`);
      link.click();
    }

  }

  render () {
    const { invoices, invoicesLoading } = this.props;

    if (invoicesLoading || (invoices.length < 1)) {
      return null;
    }

    // Perhaps need a "amounts shown in USD" message somewhere?
    //
    const maxWarning = invoices.length === 20
      ? <Panel.Footer left={<p><small>Only your last 20 invoices are available to be viewed</small></p>} />
      : null;

    return (
      <Fragment>
        <Panel title='Invoice History'>
          <TableCollection rows={invoices} columns={columns} getRowData={this.getRowData} />
        </Panel>
        {maxWarning}
      </Fragment>
    );

  }

}

const mapStateToProps = (state) => ({
  invoices: state.invoices.list,
  invoicesLoading: state.invoices.invoicesLoading,
  invoice: state.invoices.invoice,
  invoiceLoading: state.invoices.invoiceLoading
});

// In case 'status' & 'invoiceNumber' don't work out
// <Collection rows={invoices} rowComponent={Invoice}/>
// const Invoice = ({ date, amount, invoiceNumber }) => (
//   <Panel.Section actions={[{ content: 'Download' }]}>//
//     <h6 style={{ marginBottom: 0 }}><strong>{formatCurrency(amount)}</strong></h6>
//     <small>{formatDate(date)}</small>
//   </Panel.Section>
// );

export default connect(mapStateToProps, { getInvoices, getInvoice })(InvoiceHistory);
