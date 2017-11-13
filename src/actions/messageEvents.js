import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function getMessageEvents() {
  return sparkpostApiRequest({
    type: 'GET_MESSAGE_EVENTS',
    meta: {
      method: 'GET',
      url: '/message-events'
    }
  });
}

