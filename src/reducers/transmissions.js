const transmissionReducer = (
  state = {
    log: [],
    sending: false
  },
  action
) => {
  switch (action.type) {
    case 'SEND_TRANSMISSION_FAIL':
      return { ...state, sending: false };
    case 'SEND_TRANSMISSION_PENDING':
      return { ...state, sending: true };
    case 'SEND_TRANSMISSION_SUCCESS':
      return {
        ...state,
        sending: false,
        log: [
          ...state.log,
          action.meta.data.recipients[0].address.email
        ]
      };
  }

  return state;
};


export default transmissionReducer;
