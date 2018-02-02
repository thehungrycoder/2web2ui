import * as webhooks from '../webhooks';

describe('Webhooks Helpers', () => {

  describe('mergeWebhooks', () => {
    it('should reassign master account webhooks', () => {
      const masterOnly = [{ id: 'master1', name: 'master1name' }];
      const all = [
        { id: 'master1', name: 'master1name' },
        { id: '2', name: '2name' },
        { id: '3', name: '3name', subaccount_id: 101 }
      ];
      expect(webhooks.mergeWebhooks(masterOnly, all)).toMatchSnapshot();
    });
  });

});
