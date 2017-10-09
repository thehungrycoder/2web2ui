export default (state = false, { type }) => {
  if (type === 'ACCESS_CONTROL_READY') {
    return true;
  }

  return state;
};
