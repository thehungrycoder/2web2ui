/**
 * Takes the nested event groups that come from the API,
 * stored in state.webhooks.docs, e.g.:
  {
    "docs": {
      "group1": {
        "events": {
          "event1": { a: 1, b: 2 },
          "event2": { a: 11, b: 22 }
        }
      },
      "group2": {
        "events": {
          "event3": { a: 111, b: 222 },
          "event4": { a: 1111, b: 2222 }
        }
      }
    }
  }
 *
 * and returns a flattened list of event objects, e.g.:
  [
    { key: "event1", a: 1, b: 2 },
    { key: "event2", a: 11, b: 22 },
    { key: "event3": a: 111, b: 222 },
    { key: "event4", a: 1111, b: 2222 }
  ]
 *
 */
export function selectEventListing(state) {
  const { docs = {}} = state.webhooks;

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
