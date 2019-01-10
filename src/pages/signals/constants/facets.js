const facets = [
  {
    key: 'campaign_id',
    label: 'Campaign',
    sortable: true
  },
  {
    key: 'ip_pool',
    label: 'IP Pool',
    sortable: true
  },
  {
    key: 'sending_domain',
    label: 'Sending Domain',
    sortable: true
  }
];


export const defaultFacet = {
  key: 'sid',
  label: 'Subaccount',
  sortable: false
};

export const facetsByKey = facets.reduce((acc, facet) => ({ ...acc, [facet.key]: facet }), {});

export default facets;
