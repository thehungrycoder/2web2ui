import globalAlertReducer from '../globalAlert';

describe('Reducer: globalAlert', () => {

  let action;
  let stateA;

  beforeEach(() => {
    action = {
      type: 'SHOW_GLOBAL_ALERT',
      payload: { dedupeId: 'TEST' }
    };
    stateA = globalAlertReducer({ alerts: []}, action);
  });

  it('should add an alert to the store', () => {
    expect(stateA.alerts).toHaveLength(1);
  });

  it('should return the same state reference if dedupeIds match existing alerts', () => {
    const stateB = globalAlertReducer(stateA, action);
    expect(stateB).toBe(stateA);
    expect(stateB.alerts).toHaveLength(1);
  });

  it('should add alerts with different dedupeIds', () => {
    action.payload.dedupeId = 'OTHER';
    const stateC = globalAlertReducer(stateA, action);
    expect(stateC).not.toBe(stateA);
    expect(stateC.alerts).toHaveLength(2);
  });

  it('should add alerts with no dudupeId', () => {
    delete action.payload.dedupeId;
    const stateD = globalAlertReducer(stateA, action);
    expect(stateD).not.toBe(stateA);
    expect(stateD.alerts).toHaveLength(2);
  });

  it('should clear an alert by id but leave the others', () => {
    delete action.payload.dedupeId;
    const stateB = globalAlertReducer(stateA, action);
    const stateC = globalAlertReducer(stateB, action);

    expect(stateC.alerts).toHaveLength(3);

    const stateD = globalAlertReducer(stateC, {
      type: 'CLEAR_GLOBAL_ALERT',
      payload: {
        id: stateC.alerts[1].id
      }
    });
    expect(stateD.alerts).toHaveLength(2);
  });

});
