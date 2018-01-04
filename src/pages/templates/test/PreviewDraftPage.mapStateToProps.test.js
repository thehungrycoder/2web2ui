import cases from 'jest-in-case';
import { mapStateToProps } from '../PreviewDraftPage';

const TEST_CASES = {
  'returns preview and template': {
    templates: {
      byId: {
        'test-template': {
          draft: { id: 'test-template' }
        }
      },
      contentPreview: {
        draft: {
          'test-template': { id: 'test-template' }
        }
      }
    }
  },
  'returns undefined preview and template': {
    templates: {
      byId: {},
      contentPreview: {
        draft: {}
      }
    }
  }
};

cases('PreviewDraftPage.mapStateToProps', (state) => {
  const props = {
    match: {
      params: {
        id: 'test-template'
      }
    }
  };

  expect(mapStateToProps(state, props)).toMatchSnapshot();
}, TEST_CASES);
