import selectAccessCondtionState from '../accessConditionState';

describe('Selector: Access Condition State', () => {

  it('should return the correct state', () => {
    const state = {
      account: {},
      currentUser: {},
      accessControlReady: false
    };
    expect(selectAccessCondtionState(state)).toEqual({
      account: state.account,
      currentUser: state.currentUser,
      ready: false
    });
  });

});
