import { getSubaccounts, selectSubaccountIdFromQuery } from 'src/selectors/subaccounts';
import { createSelector } from 'reselect';
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


/*
 * Selects subaccount object from qp
 * Used to fill in initial values for the subaccount typeahead
 * A variation of the selectSubaccountFromQuery subaccount selector
 */
export const selectInitialSubaccountValue = createSelector(
  [getSubaccounts, selectSubaccountIdFromQuery],
  (subaccounts, id) => {

    if (Number(id) === 0) {
      return 'Master account only';
    }

    if (id === undefined) {
      return 'Master and all subacconts';
    }

    return _.find(subaccounts, { id: Number(id) });
  }
);
