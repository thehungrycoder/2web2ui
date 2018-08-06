import cases from 'jest-in-case';
import eventsMap from '../eventsMap';

jest.mock('../actionToEvents');

const TEST_CASES = {
  '@@redux-form/INITIALIZE': { arg: 'Initialize' },
  '@@redux-form/START_SUBMIT': { arg: 'Submit' },
  '@@redux-form/SET_SUBMIT_SUCCEEDED': { arg: 'Submit Success' },
  '@@redux-form/SET_SUBMIT_FAILED': { arg: 'Submit Failure' }
};

cases('Events Map', ({ name, arg }) => {
  expect(eventsMap[name]()).toEqual(arg);
}, TEST_CASES);
