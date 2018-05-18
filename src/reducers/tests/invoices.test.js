import cases from 'jest-in-case';
import invoicesReducer, { initialState } from '../invoices';

const TEST_CASES = {
  'list invoices pending': {
    type: 'LIST_INVOICES_PENDING'
  },
  'list invoices success': {
    type: 'LIST_INVOICES_SUCCESS',
    payload: {
      results: ['an invoice', 'a different invoice']
    }
  },
  'list invoice fail': {
    type: 'LIST_INVOICES_FAIL',
    payload: {
      errors: [{ message: 'an error message' }]
    }
  },
  'get invoice pending': {
    type: 'GET_INVOICE_PENDING',
    meta: {
      invoiceId: 'thisId',
      invoiceNumber: 'thisNumber'
    }
  },
  'get invoice success': {
    type: 'GET_INVOICE_SUCCESS',
    meta: { data: 'an invoice' }
  },
  'get invoice fail': {
    type: 'GET_INVOICE_FAIL',
    payload: {
      errors: [{ message: 'an error message' }]
    }
  }
};

cases('Invoices reducer', (action) => {
  expect(invoicesReducer(initialState, action)).toMatchSnapshot();
}, TEST_CASES);
