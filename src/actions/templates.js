export function listTemplates () {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'LIST_TEMPLATES',
      method: 'GET',
      url: `/templates`
    }
  };
}
