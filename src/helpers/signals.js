export const getFriendlyTitle = ({ prefix, facet, facetId }) => {
  if (!prefix) {
    return null;
  }

  let subtitle = `${prefix} ${facetId}`;

  if (facet === 'sid') {
    subtitle = `${prefix} Subaccount ${facetId}`;

    if (String(facetId) === '0') {
      subtitle = `${prefix} Master Account`;
    }
  }

  return subtitle;
};
