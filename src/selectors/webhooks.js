import { formatDateTime } from 'src/helpers/date';
import _ from 'lodash';
const selectBatches = (state) => state.webhooks.batches;
const formatStatus = (code) => _.inRange(code, 200, 300) ? 'Success' : 'Fail';

export const selectWebhookBatches = (state) => {
  const batches = selectBatches(state);

  return batches.map((batch) => ({
    ...batch,
    status: formatStatus(batch.response_code),
    formatted_time: formatDateTime(batch.ts)
  }));
};
