import { createMiddleware } from 'redux-beacon';
import { pushEvents } from './index';
import eventsMap from './eventsMap';


export const gtmMiddleware = createMiddleware(eventsMap, pushEvents);
