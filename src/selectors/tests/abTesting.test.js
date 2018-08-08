import * as selectors from '../abTesting';

describe('Selectors: abTesting', () => {
  let state;
  let props;

  beforeEach(() => {
    const mockNow = new Date('2010-01-01T12:00:00.000Z');
    global.Date = jest.fn(() => mockNow);

    state = {
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
              metric: 'count_unique_confirmed_opened',
              start_time: '2016-01-01T12:00:00.000Z',
              end_time: '2016-01-01T12:00:00.000Z',
              default_template: {
                template_id: 'template_one',
                sample_size: 50
              },
              variants: [
                { template_id: 'template_two', sample_size: 50 }
              ]
            },
            version_2: {
              name: 'test 2 version 2'
            }
          }
        }
      },
      templates: {
        list: [{ id: 'template_one' }, { id: 'template_two' }]
      }
    };

    props = {
      match: {
        params: {
          id: 'test_2',
          version: '2'
        }
      }
    };
  });

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
