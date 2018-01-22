export function getSubaccountQuery(id) {
  return id ? `?subaccount=${id}` : '';
}
