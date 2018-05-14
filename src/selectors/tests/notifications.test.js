import {
  selectActiveNotifications,
  selectTransformedNotifications,
  selectUnread,
  selectUnreadCount
} from '../notifications';
import * as helpers from '../helpers/transformNotifications';
import moment from 'moment';

jest.mock('../helpers/transformNotifications');

describe('Selector: Notifications', () => {

  let state;

  beforeEach(() => {
    state = {
      notifications: {
        list: [{}, {}, {}]
      },
      currentUser: {
        options: {
          ui: {
            notificationsLastSeenDate: '2018-01-01'
          }
        }
      },
      account: {
        created: '2017-06-01'
      }
    };
    helpers.filterNotificationsByTimeWindow = jest.fn(() => () => true);
    helpers.sortNotificationsByActiveDate = jest.fn(() => 0);
    helpers.applyUnreadStatus = jest.fn(() => (item) => item);
  });

  describe('selectActiveNotifications', () => {

    it('should filter and sort notification list', () => {
      const timeA = moment();
      selectActiveNotifications(state);
      const timeB = moment();
      const now = helpers.filterNotificationsByTimeWindow.mock.calls[0][0];
      expect(helpers.filterNotificationsByTimeWindow).toHaveBeenCalledTimes(1);
      expect(helpers.sortNotificationsByActiveDate).toHaveBeenCalledTimes(2);
      expect(now.isSameOrAfter(timeA)).toBeTruthy();
      expect(now.isSameOrBefore(timeB)).toBeTruthy();
    });

  });

  describe('selectTransformedNotifications', () => {

    it('should transform notifications to apply unread status', () => {
      const lastSeen = state.currentUser.options.ui.notificationsLastSeenDate;
      selectTransformedNotifications(state);
      expect(helpers.applyUnreadStatus).toHaveBeenCalledWith(moment(lastSeen));
    });

    it('should apply unread status when there is no user ui option present', () => {
      const lastSeen = state.account.created;
      delete state.currentUser.options.ui;
      selectTransformedNotifications(state);
      expect(helpers.applyUnreadStatus).toHaveBeenCalledWith(moment(lastSeen));
    });

  });

  describe('selectUnread', () => {

    beforeEach(() => {
      state.notifications.list = [
        { meta: { unread: true }},
        { meta: { unread: false }},
        { meta: { unread: true }},
        { meta: { unread: true }},
        { meta: { unread: false }}
      ];
    });

    it('should return only the unread notifications', () => {
      expect(selectUnread(state)).toEqual([
        { meta: { unread: true }},
        { meta: { unread: true }},
        { meta: { unread: true }}
      ]);
    });

    it('should return a count of unread notifications', () => {
      expect(selectUnreadCount(state)).toEqual(3);
    });

  });

});
