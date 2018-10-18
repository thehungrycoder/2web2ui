export default (
  state = {
    items: [], // cannot normalize, id is not unique, needs to consider subaccount_id
    loading: false
  },
  action = {}
) => {
  switch (action.type) {
    // this is ephemeral state that redux-form temporarily handles
    // case 'CREATE_SNIPPET_*':

    case 'GET_SNIPPETS_FAIL':
      return { error: action.payload.error, loading: false };
    case 'GET_SNIPPETS_PENDING':
      return { loading: true };
    case 'GET_SNIPPETS_SUCCESS':
      return { items: action.payload, loading: false };

    default:
      return state;
  }
};
