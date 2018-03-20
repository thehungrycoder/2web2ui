/*
Called by updateWebhook. Figures out if the webhooks auth details need to be updated,
then returns those updates if so.
*/

export default function resolveAuthUpdates(values) {
  const { auth, basicUser, basicPass, clientId, clientSecret, tokenURL } = values;

  switch (auth) {
    case 'basic':
      return {
        auth_credentials: {
          username: basicUser,
          password: basicPass
        },
        auth_type: 'basic'
      };
    case 'oauth2':
      return {
        auth_request_details: {
          url: tokenURL,
          body: {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials'
          }
        },
        auth_type: 'oauth2'
      };
    default:
      return {
        auth_type: 'none'
      };
  }
}
