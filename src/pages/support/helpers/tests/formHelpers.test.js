import { generateMessage } from '../formHelpers';

describe('generateMessage', () => {
  it('should create a support ticket message with labels correctly', () => {
    const values = {
      previous_sending_domains: '1',
      previous_ips: '2',
      acquisition_practices: '3',
      hygiene: '4',
      traffic_types: '5',
      only_dedicated: 'yes',
      privacy_policy: '6',
      website: '7',
      sending_policy: null,
      terminated_from_esp: 'no',
      current_issues: '9'
    };
    expect(generateMessage(values)).toMatchSnapshot();
  });
});
