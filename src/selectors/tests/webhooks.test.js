import { selectWebhookBatches } from '../webhooks';

describe('Webhooks selectors', () => {
  const state = {
    webhooks: {
      batches: [
        {
          response_code: 100,
          ts: '2018-01-24 00:00:00.000',
          other: 'field'
        },
        {
          response_code: 201,
          ts: '2018-01-21 00:00:00.000',
          key: 'value'
        }
      ]
    }
  };

  it('should add formatted_time and status to batches store', () => {
    expect(selectWebhookBatches(state)).toMatchSnapshot();
  });
});
