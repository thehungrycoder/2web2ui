import cases from 'jest-in-case';
import { mapStateToProps } from '../PreviewPublishedPage';

const TEST_CASES = {
  'returns preview and template': {
    templates: {
      byId: {
        'test-template': {
          published: { id: 'test-template' }
        }
      },
      contentPreview: {
        published: {
          'test-template': { id: 'test-template' }
        }
      }
    }
  },
  'returns undefined preview and template': {
    templates: {
      byId: {},
      contentPreview: {
        published: {}
      }
    }
  }
};

cases('PreviewPublishedPage.mapStateToProps', (state) => {
  const props = {
    match: {
      params: {
        id: 'test-template'
      }
    }
  };

  expect(mapStateToProps(state, props)).toMatchSnapshot();
}, TEST_CASES);
