import cases from 'jest-in-case';
import supportReducer from '../support';

cases('Support Reducer', (action) => {
  expect(supportReducer(undefined, action)).toMatchSnapshot();
}, {
  'default': undefined,
  'when ticket creation fails': {
    type: 'CREATE_TICKET_FAIL',
    payload: {
      message: 'Oh no!'
    }
  },
  'when ticket creation is pending': {
    type: 'CREATE_TICKET_PENDING'
  },
  'when ticket is created': {
    type: 'CREATE_TICKET_SUCCESS',
    payload: {
      ticket_id: 123
    }
  },
  'when support panel is closed': {
    type: 'CLOSE_SUPPORT_PANEL'
  },
  'when support panel is opened': {
    type: 'OPEN_SUPPORT_PANEL'
  },
  'when support panel is opened with specific view': {
    type: 'OPEN_SUPPORT_PANEL',
    payload: {
      view: 'ticket'
    }
  }
});
