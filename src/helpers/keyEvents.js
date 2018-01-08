function onEnter(callback) {
  return function(event) {
    if ((event.key === 'Enter' || event.keyCode === 13) && !event.shiftKey) {
      return callback(event);
    }
  };
}


export {
  onEnter
};
