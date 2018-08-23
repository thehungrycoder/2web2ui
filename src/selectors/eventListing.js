import { createSelector } from 'reselect';

const selectWebhooksDocs = (state) => state.webhooks.docs || {};
const selectMessageEventsDocs = (state) => state.messageEvents.documentation || {};

export const selectEventListing = createSelector(
  [selectWebhooksDocs],
  (docs) => {
    const list = Object.keys(docs).reduce((accumulated, groupName) => {
      const group = docs[groupName];
      const listForGroup = Object.keys(group.events).map((key) => ({
        key,
        ...group.events[key]
      }));
      return [...accumulated, ...listForGroup];
    }, []);

    list.sort(({ display_name: a = '' }, { display_name: b = '' }) => (a.toLowerCase() < b.toLowerCase()) ? -1 : 1);

    return list;
  }
);

export const selectMessageEventsEventListing = createSelector(
  [selectMessageEventsDocs],
  (docs) => Object.keys(docs).sort()
);
