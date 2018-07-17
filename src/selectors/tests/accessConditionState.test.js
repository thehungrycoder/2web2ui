import selectAccessCondtionState, { onPlan, isAws, isSelfServeBilling } from '../accessConditionState';
import * as accountConditions from 'src/helpers/conditions/account';

jest.mock('src/helpers/conditions/account');

describe('Selector: Access Condition State', () => {

  let testState;
  let testAccessConditionState;
  let onPlanMock;

  beforeEach(() => {
    testState = {
      account: {
        subscription: {
          code: 'plan2'
        }
      },
      billing: {
        plans: [
          { code: 'plan1', name: 'Plan 1' },
          { code: 'plan2', name: 'Plan 2' },
          { code: 'plan3', name: 'Plan 3' }
        ]
      },
      currentUser: {},
      accessControlReady: false
    };

    testAccessConditionState = {
      account: testState.account,
      currentUser: testState.currentUser,
      accountPlan: testState.billing.plans[1],
      plans: testState.billing.plans,
      ready: false
    };

    onPlanMock = jest.fn();
    accountConditions.onPlan = jest.fn(() => onPlanMock);
  });

  test('default selector should return the correct state', () => {
    expect(selectAccessCondtionState(testState)).toEqual(testAccessConditionState);
  });

  test('onPlan condition selector should call condition with correct state', () => {
    onPlan('test1')(testState);
    expect(accountConditions.onPlan).toHaveBeenCalledWith('test1');
    expect(onPlanMock).toHaveBeenCalledWith(testAccessConditionState);
  });

  test('isAws condition selector should call condition with correct state', () => {
    isAws(testState);
    expect(accountConditions.isAws).toHaveBeenCalledWith(testAccessConditionState);
  });

  test('isSelfServeBilling condition selector should call condition with correct state', () => {
    isSelfServeBilling(testState);
    expect(accountConditions.isSelfServeBilling).toHaveBeenCalledWith(testAccessConditionState);
  });

});
