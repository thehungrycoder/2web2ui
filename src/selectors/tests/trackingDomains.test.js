import {
  convertStatus,
  selectTrackingDomainsAreLoaded,
  selectTrackingDomainsList,
  selectUnverifiedTrackingDomains
} from '../trackingDomains';

describe('Selectors: Tracking Domains', () => {

  let testDomains;

  beforeEach(() => {
    testDomains = [
      { domain: '1.com', status: { verified: true, compliance_status: 'valid' }},
      { domain: '2.com', status: { verified: false, compliance_status: 'blocked' }},
      { domain: '3.com', status: { verified: false, compliance_status: 'valid' }}
    ];
  });

  describe('convertStatus', () => {

    it('should return the compliance status if not valid', () => {
      expect(convertStatus({ compliance_status: 'notvalid' })).toEqual('notvalid');
    });

    it('should return unverified if compliance status is valid and verified is false', () => {
      const state = {
        compliance_status: 'valid',
        verified: false
      };
      expect(convertStatus(state)).toEqual('unverified');
    });

    it('should return verified if compliance status is valid and verified is true', () => {
      const state = {
        compliance_status: 'valid',
        verified: true
      };
      expect(convertStatus(state)).toEqual('verified');
    });

  });

  describe('selectTrackingDomainsAreLoaded', () => {

    it('should return true if list is present and empty', () => {
      const state = {
        trackingDomains: {
          list: []
        }
      };
      expect(selectTrackingDomainsAreLoaded(state)).toEqual(true);
    });

    it('should return true if list is present and full', () => {
      const state = {
        trackingDomains: {
          list: testDomains
        }
      };
      expect(selectTrackingDomainsAreLoaded(state)).toEqual(true);
    });

    it('should return false if list is absent', () => {
      const state = {
        trackingDomains: {}
      };
      expect(selectTrackingDomainsAreLoaded(state)).toEqual(false);
    });

  });

  describe('selectTrackingDomainsList', () => {

    it('should return an empty array if list is not present', () => {
      const state = {
        trackingDomains: {}
      };
      expect(selectTrackingDomainsList(state)).toEqual([]);
    });

    it('should return a transformed array if list is present', () => {
      const state = {
        trackingDomains: {
          list: testDomains
        }
      };
      expect(selectTrackingDomainsList(state)).toMatchSnapshot();
    });

  });

  describe('selectUnverifiedTrackingDomains', () => {

    it('should return a list of unverified domains', () => {
      const state = {
        trackingDomains: {
          list: testDomains
        }
      };
      const unverified = selectUnverifiedTrackingDomains(state);
      expect(unverified.length).toEqual(2);
      expect(unverified).toMatchSnapshot();
    });

    it('should return an empty array when the list is absent', () => {
      const state = {
        trackingDomains: {}
      };
      expect(selectUnverifiedTrackingDomains(state)).toEqual([]);
    })

  })
});

