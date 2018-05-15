import React from 'react';
import { shallow } from 'enzyme';
import { InvoiceHistory } from '../InvoiceHistory';

describe('Component: Invoice History', () => {

  jest.mock('src/actions/invoices');

  let wrapper;
  let props;

  beforeEach(() => {

    props = {
      invoices: [
        { 'id': 'id0','amount': 3.34,'balance': 0,'invoice_date': '2018-05-04','invoice_number': 'no0' },
        { 'id': 'id1','amount': 0,'balance': 0,'invoice_date': '2018-04-26','invoice_number': 'no1' },
        { 'id': 'id2','amount': 302.17,'balance': 0,'invoice_date': '2018-04-26','invoice_number': 'no2' },
        { 'id': 'id3','amount': 173.79,'balance': 0,'invoice_date': '2018-02-27','invoice_number': 'no3' },
        { 'id': 'id4','amount': 25.33,'balance': 0,'invoice_date': '2017-11-20','invoice_number': 'no4' },
        { 'id': 'id5','amount': 9,'balance': 0,'invoice_date': '2017-11-09','invoice_number': 'no5' }
      ],
      invoiceLoading: false,
      invoiceId: null,
      invoice: null,
      invoiceNumber: null
    };

    wrapper = shallow(<InvoiceHistory {...props}/>);

  });

  it('should show a list of invoices', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should tell the user if there are no invoices', () => {
    wrapper.setProps({ invoices: []});
    expect(wrapper).toMatchSnapshot();
  });

  it('should deactivate download buttons while an invoice is downloading', () => {
    wrapper.setProps({ invoiceLoading: true, invoiceId: 'id1' });
    const row = wrapper.instance().getRowData({ 'id': 'id0','amount': 3.34,'balance': 0,'invoice_date': '2018-05-04','invoice_number': 'no0' });
    expect(row[3]).toMatchSnapshot();
  });

  it('should change the text of the download button in the row of the downloading invoice', () => {
    wrapper.setProps({ invoiceLoading: true, invoiceId: 'id1' });
    const row = wrapper.instance().getRowData({ 'id': 'id1','amount': 0,'balance': 0,'invoice_date': '2018-04-26','invoice_number': 'no1' });
    expect(row[3]).toMatchSnapshot();
  });

  it('should get an invoice when the download button is clicked', () => {

    const getInvoiceMock = jest.fn();
    wrapper.setProps({ getInvoice: getInvoiceMock });

    const button = shallow(wrapper.instance()
      .getRowData({ 'id': 'id1','amount': 0,'balance': 0,'invoice_date': '2018-04-26','invoice_number': 'no1' })[3]
    ).find('Button');

    button.simulate('click');
    expect(getInvoiceMock).toHaveBeenCalledWith('id1', 'no1');
  });

});
