import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export const sendTransmission = ({ recipient, template }) => (
  sparkpostApiRequest({
    type: 'SEND_TRANSMISSION',
    meta: {
      method: 'POST',
      url: '/v1/transmissions',
      data: {
        content: {
          template_id: template
        },
        recipients: [
          {
            address: {
              email: recipient
            }
          }
        ]
      }
    }
  })
);
