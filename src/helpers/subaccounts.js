export function setSubaccountQuery(id) {
  return typeof id !== 'undefined' ? `?subaccount=${id}` : '';
}
