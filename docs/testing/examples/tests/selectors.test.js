import { selectSummary } from '../selectors';

describe('Selectors', () => {

  it('should select a summary', () => {
    const state = {
      users: [1, 2, 3],
      accounts: ['a', 'b', 'c', 'd', 'e'],
      bills: [
        { total: 114.50 },
        { total: 15.00 },
        { total: 219.85 }
      ]
    };
    const selected = selectSummary(state);
    expect(selected).toMatchSnapshot();
  });

});
