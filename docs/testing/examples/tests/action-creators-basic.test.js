import { basicActionCreator } from '../action-creators';

describe('Action creators that return basic JSON', () => {

  it('should return a basic action', () => {
    expect(basicActionCreator({ name: 'Jo' })).toMatchSnapshot();
  });

  it('should return an empty object if no options are given', () => {
    // when it's easier to assert the real value, it's often clearer
    // to do that instead of matching against a snapshot
    expect(basicActionCreator()).toEqual({});
  });

  it('should return an empty object if no name is given', () => {
    expect(basicActionCreator({ other: 'whatever' })).toEqual({});
  });

});

