import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import * as actions from '../accountSingleSignOn';

jest.mock('src/actions/helpers/sparkpostApiRequest');

snapshotActionCases('Action: Current User', {
  getAccountSingleSignOnDetails: {
    action: actions.getAccountSingleSignOnDetails
  },
  provisionAccountSingleSignOn: {
    action: () => actions.provisionAccountSingleSignOn('abc==')
  },
  reprovisionAccountSingleSignOn: {
    action: () => actions.reprovisionAccountSingleSignOn('abc==')
  },
  updateAccountSingleSignOn: {
    action: () => {
      const args = {
        cert: 'abc==',
        enabled: true,
        provider: 'https://sso.sparkpost.com/redirect'
      };

      return actions.updateAccountSingleSignOn(args);
    }
  }
});
