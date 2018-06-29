export function selectEventListing(state) {
  const { docs = []} = state.webhooks;

  const list = Object.keys(docs).reduce((list, group) => {
    const eventList = Object.keys(docs[group].events).map((key) => ({
      key,
      ...docs[group].events[key]
    }));
    return [...list, ...eventList];
  }, []);

  list.sort(({ display_name: a = '' }, { display_name: b = '' }) => (a.toLowerCase() < b.toLowerCase()) ? -1 : 1);

  return list;
}
