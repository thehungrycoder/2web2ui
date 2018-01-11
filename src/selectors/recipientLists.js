import { createSelector } from 'reselect';

const allLists = (state) => state.recipientLists.list;
const listLoading = (state) => state.recipientLists.loading;
const currentId = (state) => state.recipientLists.currentId;

const currentRecipientList = createSelector(
  [listLoading, allLists, currentId],
  (loading, list, currentId) => list.find((item) => item.id === currentId)
);
export default currentRecipientList;
