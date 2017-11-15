export default function filterBoxReducer(state = '', { type, payload }) {
  switch (type) {
    case 'FILTER_BOX_MODIFIER_ADDED':
      return payload;

    default:
      return state;
  }
}
