import * as selectors from '../abTesting';

describe('Selectors: abTesting', () => {
  const state = {
    abTesting: {
      detailsById: {
        test_1: {
          latest: 1,
          version_1: {}
        },
        test_2: {
          latest: 2,
          version_1: {
            name: 'test 2 version 1',
            engagement_timeout: 2,
            confidence_level: 0.1,
            test_mode: 'learning',
            audience_selection: 'sample_size',
            total_sample_size: 100,
            metric: 'count_unique_confirmed_opened'
          },
          version_2: {
            name: 'test 2 version 2'
          }
        }
      }
    }
  };

  const props = {
    match: {
      params: {
        id: 'test_2',
        version: '2'
      }
    }
  };

  it('should selects ID and version from router params', () => {
    expect(selectors.selectIdAndVersionFromParams(state, props)).toMatchSnapshot();
  });

  it('should selects a single ab test from router params', () => {
    expect(selectors.selectAbTestFromParams(state, props)).toMatchSnapshot();
  });

  it('should selects a single tests latest version number from router params', () => {
    expect(selectors.selectLatestVersionNumberFromParams(state, props)).toMatchSnapshot();
  });

  it('should generate initial values with all defaults for the edit form correctly', () => {
    expect(selectors.selectEditInitialValues(state, props)).toMatchSnapshot();
  });

  it('should generate initial values with overridden defaults for the edit form correctly', () => {
    expect(selectors.selectEditInitialValues(state, { match: { params: { id: 'test_2', version: 1 }}})).toMatchSnapshot();
  });

});
