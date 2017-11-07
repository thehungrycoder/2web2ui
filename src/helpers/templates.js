const getTestDataKey = ({ id, username, mode }) => ([ 'tpldata', username, id, mode === 'draft' ? 'd' : 'p' ].join('/'));

export {
  getTestDataKey
};
