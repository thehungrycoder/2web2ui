import { duplicate } from '../snippets';

describe('.duplicate', () => {
  it('returns copy of snippet', () => {
    const snippet = {
      id: 'test-snippet',
      content: {
        html: '<p>test</p>'
      }
    };

    expect(duplicate(snippet)).toEqual({
      id: 'test-snippet-copy',
      name: 'Test Snippet Copy',
      content: {
        html: '<p>test</p>'
      }
    });
  });
});
