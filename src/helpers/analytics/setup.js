import { createMiddleware } from 'redux-beacon';
import { pushEvents } from './index';
import eventsMap from './eventsMap';


const analyticsMiddleware = createMiddleware(eventsMap, pushEvents);

export default analyticsMiddleware;
