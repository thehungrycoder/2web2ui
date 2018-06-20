import { createMiddleware } from 'redux-beacon';
import logger from '@redux-beacon/logger';
import { pushEvents } from '../analytics';

import eventsMap from './eventsMap';

export const gtmMiddleware = createMiddleware(eventsMap, pushEvents, { logger });
