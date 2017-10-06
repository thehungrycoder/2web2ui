import compose from '../compose';

describe('Condition Helper: compose conditions', () => {

  it('should call all the functions with the args and return a single result', () => {
    const c1 = jest.fn(() => true);
    const c2 = jest.fn(() => true);
    const c3 = jest.fn(() => true);

    const opts = {};
    const composed = compose(c1, c2, c3);
    const result = composed(opts);

    expect(c1).toHaveBeenCalledWith(opts);
    expect(c2).toHaveBeenCalledWith(opts);
    expect(c3).toHaveBeenCalledWith(opts);
    expect(result).toEqual(true);
  });

  it('should stop calling functions when one returns false', () => {
    const c1 = jest.fn(() => true);
    const c2 = jest.fn(() => false);
    const c3 = jest.fn(() => true);

    const opts = {};
    const composed = compose(c1, c2, c3);
    const result = composed(opts);

    expect(c1).toHaveBeenCalledWith(opts);
    expect(c2).toHaveBeenCalledWith(opts);
    expect(c3).not.toHaveBeenCalled();
    expect(result).toEqual(false);
  });

});
