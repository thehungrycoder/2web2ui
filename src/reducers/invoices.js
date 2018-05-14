const initialState = {
  list: [],
  invoiceLoading: false,
  invoicesLoading: false,
  invoiceId: null
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'LIST_INVOICES_PENDING':
      return { ...state, invoicesLoading: true, listError: null };

    case 'LIST_INVOICES_SUCCESS':
      return { ...state, list: payload, invoicesLoading: false };

    case 'LIST_INVOICES_FAIL':
      return { ...state, listError: payload, invoicesLoading: false };

    case 'GET_INVOICE_PENDING':
      return { ...state, invoiceLoading: true, getError: null, invoice: null, invoiceId: meta.invoiceId };

    case 'GET_INVOICE_FAIL':
      return { ...state, invoiceLoading: false, getError: payload, invoice: null, invoiceId: null };

    case 'GET_INVOICE_SUCCESS':
      return { ...state, invoiceLoading: false, invoice: meta.data, invoiceId: null };

    default:
      return state;
  }
};
