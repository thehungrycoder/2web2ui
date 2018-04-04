import chainActions from '../chainActions';

describe('Action chain helper', () => {
  const action1 = jest.fn(({ meta }) => meta.onSuccess({ results: 1 }));
  const action2 = jest.fn(({ results, meta }) => meta.onSuccess({ results: results + 1 }));
  const action3 = jest.fn(({ results, meta }) => meta.onSuccess({ results: results + 1 }));
  const action4 = jest.fn(({ results }) => results + 1);

  it('should chain actions off onSuccess callback', () => {
    const chainedActions = chainActions(action1, action2, action3, action4)();

    expect(chainedActions).toBe(4);
    expect(action1).toHaveBeenCalled();
    expect(action2).toHaveBeenCalled();
    expect(action3).toHaveBeenCalled();
    expect(action4).toHaveBeenCalled();
  });
});
