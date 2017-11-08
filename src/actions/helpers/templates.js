/**
 * Gets key for templates test data in local storate
 * @param  {string} id - template id
 * @param  {string} username - current user's username
 * @param  {string} mode - 'draft' | 'published'
 * @return {string} key
 */
const getTestDataKey = ({ id, username, mode }) => ([ 'tpldata', username, id, mode === 'draft' ? 'd' : 'p' ].join('/'));

export {
  getTestDataKey
};
