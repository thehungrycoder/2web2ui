export default function({ id, name, target, auth_type, auth_credentials = {}, auth_request_details = {}}) {
  const values = { id, name, target };

  switch (auth_type) {
    case 'basic':
      values.auth = auth_type;
      values.basicUser = auth_credentials.username;
      values.basicPass = auth_credentials.password;
      break;

    case 'oauth2':
      values.auth = auth_type;
      values.clientId = auth_request_details.body.client_id;
      values.clientSecret = auth_request_details.body.client_secret;
      values.tokenURL = auth_request_details.url;
      break;

    default:
      break;
  }

  return values;
}
