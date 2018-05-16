import {
  applyUnreadStatus,
  getPrecision,
  filterNotificationsByTimeWindow
} from '../transformNotifications';
import moment from 'moment';
import cases from 'jest-in-case';

describe('Notifications selector helper', () => {

  describe('getPrecision', () => {

    it('should return undefined if no date is present', () => {
      expect(getPrecision()).toBeUndefined();
    });

    it('should return "day" if the date is 10 characters', () => {
      expect(getPrecision('2018-05-04')).toEqual('day');
    });

    it('should return undefined if the date is not 10 characters', () => {
      expect(getPrecision('2018-3-4')).toBeUndefined();
      expect(getPrecision('2018-05-15T12:42:25-0400')).toBeUndefined();
    });

  });

  describe('filterNotificationsByTimeWindow', () => {

    cases('activeDate', ({ now, keep, ...meta }) => {
      const testFilter = filterNotificationsByTimeWindow(moment(new Date(now)));
      expect([{ meta }].filter(testFilter)).toHaveLength(keep ? 1 : 0);
    }, [
      {
        name: 'should keep when day is before the "now" day',
        activeDate: '2018-05-04',
        now: '2018-05-05T12:00:00-00:00',
        keep: true
      },
      {
        name: 'should keep when day is the same as the "now" day',
        activeDate: '2018-05-05',
        now: '2018-05-05T12:00:00-00:00',
        keep: true
      },
      {
        name: 'should not keep when day is later than the "now" day',
        activeDate: '2018-05-06',
        now: '2018-05-05T12:00:00-00:00',
        keep: false
      },
      {
        name: 'should keep when exact time is before now',
        activeDate: '2018-05-05T05:00:00-00:00',
        now: '2018-05-05T12:00:00-00:00',
        keep: true
      },
      {
        name: 'should keep when exact time is before now (after timezone is applied)',
        activeDate: '2018-05-05T15:00:00-04:00', // UTC 19:00
        now: '2018-05-05T12:00:00-08:00', // UTC 20:00
        keep: true
      },
      {
        name: 'should keep when exact time is exactly the same as now',
        activeDate: '2018-05-05T12:00:00-00:00',
        now: '2018-05-05T12:00:00-00:00',
        keep: true
      },
      {
        name: 'should not keep when exact time is after now',
        activeDate: '2018-05-05T12:00:01-00:00',
        now: '2018-05-05T12:00:00-00:00',
        keep: false
      }
    ]);

    cases('expirationDate', ({ now, keep, ...meta }) => {
      const testFilter = filterNotificationsByTimeWindow(moment(new Date(now)));
      expect([{ meta }].filter(testFilter)).toHaveLength(keep ? 1 : 0);
    }, [
      {
        name: 'should keep when expiration day is after the "now" day',
        activeDate: '2018-05-01',
        now: '2018-05-05T12:00:00-00:00',
        expirationDate: '2018-05-06',
        keep: true
      },
      {
        name: 'should not keep when expiration day is the same as the "now" day',
        activeDate: '2018-05-01',
        now: '2018-05-05T12:00:00-00:00',
        expirationDate: '2018-05-05',
        keep: false
      },
      {
        name: 'should not keep when expiration day is before the "now" day',
        activeDate: '2018-05-01',
        now: '2018-05-05T12:00:00-00:00',
        expirationDate: '2018-05-04',
        keep: false
      },
      {
        name: 'should keep when exact expiration time is after now',
        activeDate: '2018-05-01',
        now: '2018-05-05T12:00:00-00:00',
        expirationDate: '2018-05-05T12:00:01-00:00',
        keep: true
      },
      {
        name: 'should keep when exact expiration time is after now (after timezone is applied)',
        activeDate: '2018-05-01',
        now: '2018-05-05T12:00:00-00:00', // UTC 12:00
        expirationDate: '2018-05-05T06:00:00-08:00', // UTC 14:00
        keep: true
      },
      {
        name: 'should not keep when exact expiration time is exactly the same as now',
        activeDate: '2018-05-01',
        now: '2018-05-05T12:00:00-00:00',
        expirationDate: '2018-05-05T12:00:00-00:00',
        keep: false
      },
      {
        name: 'should not keep when exact expiration time is before now',
        activeDate: '2018-05-01',
        now: '2018-05-05T12:00:00-00:00',
        expirationDate: '2018-05-05T10:59:59-00:00',
        keep: false
      }
    ]);

  });

  describe('applyUnreadStatus', () => {
    const cutoff = moment('2018-02-14');

    it('should return notification as unread', () => {
      const notification = {
        meta: {
          activeDate: moment('2018-02-15')
        }
      };

      expect(applyUnreadStatus(cutoff)(notification)).toHaveProperty('meta.unread', true);
    });

    it('should return notification as read', () => {
      const notification = {
        meta: {
          activeDate: moment('2018-02-13')
        }
      };

      expect(applyUnreadStatus(cutoff)(notification)).toHaveProperty('meta.unread', false);
    });
  });
});
