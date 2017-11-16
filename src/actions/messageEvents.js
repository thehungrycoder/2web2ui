import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { subDays, format } from 'date-fns';
// import { formatHistory } from 'src/helpers/messageEvents';

export function getMessageEvents(params = {}) {
  return sparkpostApiRequest({
    type: 'GET_MESSAGE_EVENTS',
    meta: {
      method: 'GET',
      url: '/message-events',
      params
    }
  });
}

export function getMessageHistory({ messageId, params = {}}) {
  return (dispatch) => {
    const params = {
      ...params,
      message_ids: messageId,
      from: format(subDays(Date.now(), 10), 'YYYY-MM-DDTHH:MM')
    };

    return dispatch(getMessageEvents(params)).then((results) => {
      dispatch({
        type: 'GET_MESSAGE_HISTORY_SUCCESS',
        payload: { messageId, history: results }
      });
    });
  };
}

export function getDocumentation() {
  return sparkpostApiRequest({
    type: 'GET_MESSAGE_EVENTS_DOCUMENTATION',
    meta: {
      method: 'GET',
      url: '/message-events/events/documentation'
    }
  });
}
