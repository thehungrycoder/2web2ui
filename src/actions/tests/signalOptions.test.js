import { changeSignalOptions } from '../signalOptions';

describe('Signal Options Action Creators', () => {
  describe('.changeSignalOptions', () => {
    it('return action with new options as payload', () => {
      const action = changeSignalOptions({ facet: 'sending_domain' });
      expect(action).toMatchSnapshot();
    });
  });
});
