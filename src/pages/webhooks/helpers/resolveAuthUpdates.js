/*
Called by updateWebhook. Figures out if the webhooks auth details need to be updated,
then returns those updates if so.
*/

export default function(values, webhook) {
  const { auth, basicUser, basicPass, clientId, clientSecret, tokenURL } = values;
  const update = {};

  // none is undefined !== undefined
  if (auth !== webhook.auth_type) {
    switch (auth) {
      case 'basic':
        update.auth_type = 'basic';
        update.auth_credentials = { username: basicUser, password: basicPass };
        break;
      case 'oauth2':
        update.auth_type = 'oauth2';
        update.auth_request_details = {
          url: tokenURL,
          body: { client_id: clientId, client_secret: clientSecret }
        };
        break;
      default:
        update.auth_type = 'none';
        break;
    }
  } else {
    const {
      auth_credentials: authCredentials,
      auth_request_details: authRequestDetails
    } = webhook;

    switch (auth) {
      case 'basic':
        if (authCredentials.username !== basicUser ||
            authCredentials.password !== basicPass) {
          update.auth_credentials = { username: basicUser, password: basicPass };
        }
        break;
      case 'oauth2':
        if (authRequestDetails.url !== tokenURL ||
            authCredentials.body.client_id !== clientId ||
            authCredentials.body.client_secret !== clientSecret) {
          update.auth_request_details = {
            url: tokenURL,
            body: { client_id: clientId, client_secret: clientSecret }
          };
        }
        break;
      default:
        update.auth_type = 'none';
        break;
    }
  }
  return update;
}
