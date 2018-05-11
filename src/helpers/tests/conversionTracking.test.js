import * as analytics from 'src/helpers/analytics';
import * as conversions from 'src/helpers/conversionTracking';

jest.mock('src/helpers/analytics');

describe('Conversion tracking', () => {
  describe('trackPlanChange', () => {
    const allPlans = [
      { code: '27', volume: 27 },
      { code: '257', volume: 257 }
    ];

    it('should emit trackFormSuccess', () => {
      conversions.trackPlanChange({ allPlans, oldCode: '27', newCode: '257' });
      expect(analytics.trackFormSuccess).toHaveBeenCalled();
    });

    it('should emit upgrade when the new plan has higher volume', () => {
      conversions.trackPlanChange({ allPlans, oldCode: '27', newCode: '257' });
      expect(analytics.trackFormSuccess).toHaveBeenCalledWith('upgrade', {
        form_type: 'upgrade',
        plan_key: '257'
      });
    });

    it('should emit downgrade when the new plan has lower or equal volume', () => {
      conversions.trackPlanChange({ allPlans, oldCode: '257', newCode: '27' });
      expect(analytics.trackFormSuccess).toHaveBeenCalledWith('downgrade', {
        form_type: 'downgrade',
        plan_key: '27'
      });
    });
  });

  describe('trackAddonPurchase', () => {
    const addon = 'Shiny Addonington';

    beforeEach(() => {
      conversions.trackAddonPurchase(addon);
    });

    it('should emit trackFormSuccess', () => {
      expect(analytics.trackFormSuccess).toHaveBeenCalled();
    });

    it('should set event action and data', () => {
      expect(analytics.trackFormSuccess).toHaveBeenCalledWith('purchase_addon', { form_type: 'purchase_addon', addon_key: addon });
    });
  });

  describe('trackAddonRequest', () => {
    const addon = 'Gimme De-Thang';
    beforeEach(() => {
      conversions.trackAddonRequest(addon);
    });

    it('should emit trackFormSuccess', () => {
      expect(analytics.trackEvent).toHaveBeenCalled();
    });

    it('should set event, action and data', () => {
      expect(analytics.trackEvent).toHaveBeenCalledWith({
        category: 'Clicked button',
        action: addon,
        data: { action: addon }
      });
    });
  });
});
