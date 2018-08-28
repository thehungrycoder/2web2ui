import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import browsersSnapshotGen from '../browsersSnapshotGen';


describe('BrowsersSnapshotGenerator', () => {
  let snapshot;
  beforeAll(() => {
    snapshot = browsersSnapshotGen();
  });

  it('returns list of supported browser', () => {
    expect(snapshot).toMatchSnapshot();
  });
});
