const MODE_ABBRS = {
  draft: 'd',
  published: 'p'
};

/**
 * Gets key for templates test data in local storage
 * @param  {string} id - template id
 * @param  {string} username - current user's username
 * @param  {string} mode - 'draft' | 'published'
 * @return {string} key
 */
const getTestDataKey = ({ id, username, mode }) => ([ 'tpldata', username, id, MODE_ABBRS[mode] ].join('/'));

export {
  getTestDataKey
};
