import selectNavItems from '../navItems';

describe('NavItems Selectors', () => {
  const store = {
    account: {
      status: 'active'
    },
    currentUser: {
      grants: [
        'webhooks/view',
        'recipients_list/manage',
        'webhooks/modify',
        'subaccounts/manage'
      ]
    }
  };

  it('should filter nav by access of user', () => {
    expect(selectNavItems(store)).toMatchSnapshot();
  });

});
