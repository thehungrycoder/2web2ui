import { getFriendlyTitle } from '../signals';

describe('.getFriendlyTitle', () => {
  it('returns nothing with no prefix set', () => {
    expect(getFriendlyTitle({
      prefix: undefined,
      facet: 'facet',
      facetId: 'facetId'
    })).toEqual(null);
  });

  it('returns prefix with facet id if facet is not a subaccount', () => {
    expect(getFriendlyTitle({
      prefix: 'title for',
      facet: 'facet',
      facetId: 'facetId'
    })).toEqual('title for facetId');
  });

  it('returns title with subaccount id if facet is subaccount but not master', () => {
    expect(getFriendlyTitle({
      prefix: 'title for',
      facet: 'sid',
      facetId: 'facetId'
    })).toEqual('title for Subaccount facetId');
  });

  it('returns title with master account if facet is subaccount and id is 0', () => {
    expect(getFriendlyTitle({
      prefix: 'title for',
      facet: 'sid',
      facetId: 0
    })).toEqual('title for Master Account');
  });

  it('returns correct suffix with a facet and non-master subaccount', () => {
    expect(getFriendlyTitle({
      prefix: 'title for',
      facet: 'facet',
      facetId: 'facetId',
      subaccountId: 23
    })).toEqual('title for facetId (Subaccount 23)');
  });

  it('returns correct suffix with a facet and master subaccount', () => {
    expect(getFriendlyTitle({
      prefix: 'title for',
      facet: 'facet',
      facetId: 'facetId',
      subaccountId: 0
    })).toEqual('title for facetId (Master Account)');
  });
});
