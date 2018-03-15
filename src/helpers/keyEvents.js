export function onEnter(callback) {
  return function handleEnterKeydown(event) {
    if ((event.key === 'Enter' || event.keyCode === 13) && !event.shiftKey) {
      return callback(event);
    }
  };
}

export function onEscape(callback) {
  return function handleEscapeKeydown(event) {
    if ((event.key === 'Escape' || event.keyCode === 27) && !event.shiftKey) {
      return callback(event);
    }
  };
}
