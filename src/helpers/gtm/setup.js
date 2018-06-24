import { createMiddleware } from 'redux-beacon';
import { pushEvents } from '../analytics';
import eventsMap from './eventsMap';


export const gtmMiddleware = createMiddleware(eventsMap, pushEvents);
