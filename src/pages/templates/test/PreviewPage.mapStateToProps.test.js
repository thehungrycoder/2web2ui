import cases from 'jest-in-case';
import { mapStateToProps } from '../PreviewPage';

const TEST_CASES = {
  'template is undefined on initial load': {
    props: {
      match: {
        params: { id: 'test-template' },
        path: '/templates/preview/test-template'
      }
    },
    state: {
      templates: { byId: {}}
    }
  },
  'provides draft template': {
    props: {
      match: {
        params: { id: 'test-draft' },
        path: '/templates/preview/test-draft'
      }
    },
    state: {
      templates: {
        byId: {
          'test-draft': {
            draft: { id: 'test-draft' }
          }
        }
      }
    }
  },
  'provides published template': {
    props: {
      match: {
        params: { id: 'test-published' },
        path: '/templates/preview/test-published/published'
      }
    },
    state: {
      templates: {
        byId: {
          'test-published': {
            published: { id: 'test-published' }
          }
        }
      }
    }
  }
};

cases('PreviewPage.mapStateToProps', ({ props = {}, state = {}}) => {
  const nextProps = mapStateToProps(state, props);
  expect(nextProps).toMatchSnapshot();
}, TEST_CASES);
