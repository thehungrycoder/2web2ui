import { createMiddleware } from 'redux-beacon';
import googleTagManager from '@redux-beacon/google-tag-manager';
import logger from '@redux-beacon/logger';

import eventsMap from './eventsMap';

const gtm = googleTagManager();
export const gtmMiddleware = createMiddleware(eventsMap, gtm, { logger });
