import React from 'react';
import { shallow } from 'enzyme';
import { InvoiceHistory } from '../InvoiceHistory';
import _ from 'lodash';

describe('Component: Invoice History', () => {

  let wrapper;
  let props;

  beforeEach(() => {

    props = {
      invoices: [
        { 'id': 'id0','amount': 3.34,'invoice_date': '2018-05-04','invoice_number': 'no0' },
        { 'id': 'id1','amount': 0,'invoice_date': '2018-04-26','invoice_number': 'no1' },
        { 'id': 'id2','amount': 302.17,'invoice_date': '2018-04-26','invoice_number': 'no2' },
        { 'id': 'id3','amount': 173.79,'invoice_date': '2018-02-27','invoice_number': 'no3' },
        { 'id': 'id4','amount': 25.33,'invoice_date': '2017-11-20','invoice_number': 'no4' },
        { 'id': 'id5','amount': 9,'invoice_date': '2017-11-09','invoice_number': 'no5' }
      ],
      invoiceLoading: false,
      invoiceId: null,
      invoice: null
    };

    wrapper = shallow(<InvoiceHistory {...props}/>);

  });

  it('should show a list of invoices', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show a message that only 20 invoices are available if there are 20 invoices', () => {

    const invoices = _.fill(Array(20), { 'id': 'id0','amount': 3.34,'balance': 0,'invoice_date': '2018-05-04','invoice_number': 'no0' });

    wrapper.setProps({ invoices });
    expect(wrapper).toMatchSnapshot();
  });

  it('should deactivate download buttons while an invoice is downloading', () => {
    wrapper.setProps({ invoiceLoading: true, invoiceId: 'id1' });
    const row = wrapper.instance().getRowData({ 'id': 'id0','amount': 3.34,'balance': 0,'invoice_date': '2018-05-04','invoice_number': 'no0' });
    expect(row[3]).toMatchSnapshot();
  });

  it('should show the right information in a row', () => {
    const row = wrapper.instance().getRowData({ 'id': 'id0','amount': 3.34,'balance': 0,'invoice_date': '2018-05-04','invoice_number': 'no0' });
    expect(row).toMatchSnapshot();
  });

  it('should change the text of the download button in the row of the downloading invoice', () => {
    wrapper.setProps({ invoiceLoading: true, invoiceId: 'id1' });
    const row = wrapper.instance().getRowData({ 'id': 'id1','amount': 0,'balance': 0,'invoice_date': '2018-04-26','invoice_number': 'no1' });
    expect(row[3]).toMatchSnapshot();
  });

  it('should call downloadInvoice() if there is a new invoice', () => {
    const downloadInvoiceStub = jest.fn();
    wrapper.instance().downloadInvoice = downloadInvoiceStub;

    wrapper.setProps({ invoice: 'an invoice', invoiceId: 'id3' });

    expect(downloadInvoiceStub).toHaveBeenCalledTimes(1);
  });

  it('downloadInvoice() should download an invoice', () => {
    const showAlertStub = jest.fn();
    const linkMock = { setAttribute: jest.fn(), click: jest.fn() };

    //This mock must be manually restored because jsdom doesn't support URL.createObjectURL
    const defaultCreateUbjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn(() => 'a URL');

    const createElementSpy = jest.spyOn(document, 'createElement')
      .mockImplementationOnce(() => linkMock);

    wrapper = shallow(<InvoiceHistory {...props}
      invoiceId='id3'
      invoice='an invoice'
      showAlert={showAlertStub}
    />);

    wrapper.instance().downloadInvoice();

    expect(URL.createObjectURL).toHaveBeenCalledWith('an invoice');
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(linkMock.href).toEqual('a URL');
    expect(linkMock.setAttribute).toHaveBeenCalledWith('download', 'sparkpost-invoice-no3.pdf');
    expect(linkMock.click).toHaveBeenCalledTimes(1);
    expect(showAlertStub).toHaveBeenCalledTimes(1);
    expect(showAlertStub).toHaveBeenCalledWith({ type: 'success', message: 'Downloaded invoice: no3' });

    URL.createObjectURL = defaultCreateUbjectURL;
  });

  it('should get an invoice when the download button is clicked', () => {

    const getInvoiceStub = jest.fn();
    wrapper.setProps({ getInvoice: getInvoiceStub });

    const button = shallow(wrapper.instance()
      .getRowData({ 'id': 'id1','amount': 0,'balance': 0,'invoice_date': '2018-04-26','invoice_number': 'no1' })[3]
    ).find('Button');

    button.simulate('click');
    expect(getInvoiceStub).toHaveBeenCalledWith('id1');
  });

});
