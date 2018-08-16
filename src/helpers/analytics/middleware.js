import { pushEvent } from '.';
import eventsMapper from './eventsMapper';

export default function middleware() {
  return (next) => (action) => {
    const event = eventsMapper(action);

    if (event) {
      pushEvent(event);
    }

    return next(action);
  };
}
