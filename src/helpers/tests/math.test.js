import * as mathHelpers from '../math';

describe('math helpers', () => {
  it('should calculate rate', () => {
    expect(mathHelpers.safeRate(5, 10)).toEqual(50);
  });

  it('should default NaN average values to 0', () => {
    const item = { total_delivery_time_first: 5, count_delivered_first: 0 };
    const keys = ['total_delivery_time_first', 'count_delivered_first'];
    expect(mathHelpers.safeDivide(item, keys)).toEqual(0);
  });

  it('should default infinte average values to 0', () => {
    const item = { total_delivery_time_first: 0, count_delivered_first: 5 };
    const keys = ['total_delivery_time_first', 'count_delivered_first'];
    expect(mathHelpers.safeDivide(item, keys)).toEqual(0);
  });
});
