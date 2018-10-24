import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export const getAccountSingleSignOnDetails = () => (
  sparkpostApiRequest({
    type: 'GET_ACCOUNT_SSO_DETAILS',
    meta: {
      method: 'GET',
      url: '/v1/account/sso/saml'
    }
  })
);

export const provisionAccountSingleSignOn = (fileContents) => (
  sparkpostApiRequest({
    type: 'PROVISION_ACCOUNT_SSO',
    meta: {
      method: 'POST',
      url: '/v1/account/sso/saml',
      data: {
        xml_file: fileContents
      }
    }
  })
);

export const reprovisionAccountSingleSignOn = (fileContents) => (
  sparkpostApiRequest({
    type: 'REPROVISION_ACCOUNT_SSO',
    meta: {
      method: 'PUT',
      url: '/v1/account/sso/saml',
      data: {
        xml_file: fileContents
      }
    }
  })
);

export const updateAccountSingleSignOn = ({ cert, enabled, provider }) => (
  sparkpostApiRequest({
    type: 'UPDATE_ACCOUNT_SSO',
    meta: {
      method: 'PUT',
      url: '/v1/account/sso/saml',
      data: {
        cert,
        enabled,
        provider
      }
    }
  })
);
