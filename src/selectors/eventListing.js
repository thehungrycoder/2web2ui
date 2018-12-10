import { createSelector } from 'reselect';

const selectWebhooksDocs = (state) => state.webhooks.docs || {};
const selectEventsDocs = (state) => state.events.documentation || {};

export const selectWebhookEventListing = createSelector(
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

export const selectEventsListing = createSelector(
  [selectEventsDocs],
  (docs) => Object.keys(docs).sort().map((type) => {
    const evt = docs[type];
    return {
      type,
      displayName: evt.displayName,
      description: evt.description
    };
  })
);
