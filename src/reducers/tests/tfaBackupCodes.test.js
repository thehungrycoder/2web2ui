import tfaCodesReducer from '../tfaBackupCodes';

describe('Reducer: TFA Backup Codes', () => {
  it('should set activeCount to 0 when disabling tfa', () => {
    const action = {
      type: 'TFA_TOGGLE_SUCCESS',
      payload: { enabled: false }
    };

    const state = tfaCodesReducer({ activeCount: 10 }, action);
    expect(state.activeCount).toEqual(0);
  });

  it('should not change active code when TFA_TOGGLE_SUCCESS is not false', () => {
    const action = {
      type: 'TFA_TOGGLE_SUCCESS',
      payload: { enabled: true }
    };

    const state = tfaCodesReducer({ activeCount: 10 }, action);
    expect(state.activeCount).toEqual(10);

  });
});
