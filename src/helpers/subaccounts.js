export function setSubaccountQuery(id) {
  return id ? `?subaccount=${id}` : '';
}
