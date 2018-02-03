export function onEnter(callback) {
  return function handleEnterKeydown(event) {
    if ((event.key === 'Enter' || event.keyCode === 13) && !event.shiftKey) {
      return callback(event);
    }
  };
}
