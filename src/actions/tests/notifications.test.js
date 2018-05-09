import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import * as actions from '../notifications';
import * as userActions from 'src/actions/currentUser';

jest.mock('src/actions/currentUser');

beforeEach(() => {
  userActions.updateUserUIOptions = jest.fn((a) => ({ ...a, type: 'UPDATE_USER_UI_OPTIONS_TEST_TYPE' }));
});

snapshotActionCases('Action: Notifications', [
  {
    name: 'loadNotifications',
    action: actions.loadNotifications
  },
  {
    name: 'addNotification',
    action: () => actions.addNotification({ component: 'test component', meta: {}})
  },
  {
    name: 'markAllAsRead',
    action: () => actions.markAllAsRead(new Date('2018-05-01T12:00:00-00:00'))
  }
]);
