import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as brightback from '../brightback';
import sparkpostApiRequest from '../helpers/sparkpostApiRequest';
import brightbackRequest from '../helpers/brightbackRequest';

import moment from 'moment';

jest.mock('../helpers/sparkpostApiRequest');
jest.mock('../helpers/brightbackRequest');

describe('Action Creators: Brightback', () => {
  let mockStore;
  let accountDetails;

  function asyncAction(result) {
    return (action) => (dispatch) => {
      dispatch(action);
      return Promise.resolve(result);
    };
  }

  function asyncActionFail(a) {
    return (dispatch) => {
      dispatch(a);
      return Promise.reject(new Error('booom'));
    };
  }

  beforeEach(() => {
    mockStore = createMockStore({});
    accountDetails = { test: 'data' };
    const date = moment(new Date('2016-11-25T04:15:00'));
    Date.now = jest.fn(() => date);
    sparkpostApiRequest.mockImplementation(asyncAction([{
      count_accepted: 5685438,
      count_sent: 6316851,
      count_unique_confirmed_opened_approx: 2168915
    }]));
    brightbackRequest.mockImplementation(asyncAction());
  });

  describe('prepBrightback', () => {
    it('should load metrics and call precancel', async () => {
      await mockStore.dispatch(brightback.prepBrightback(accountDetails));
      expect(mockStore.getActions()).toMatchSnapshot();
    });

    it('should not call precancel if metrics did not load', async () => {
      sparkpostApiRequest.mockImplementation(asyncActionFail);
      try {
        await mockStore.dispatch(brightback.prepBrightback(accountDetails));
      } catch (e) {
        // swallow the mockception
      }
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('loadPrerequisiteMetrics', () => {
    it('should dispatch a metrics loading action', async () => {
      await mockStore.dispatch(brightback.loadPrerequisiteMetrics());
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('precancel', () => {
    it('should dispatch a precancel action', async () => {
      await mockStore.dispatch(brightback.precancel(accountDetails));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

});
