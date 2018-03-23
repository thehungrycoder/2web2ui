import { matchPath } from 'react-router';
import _ from 'lodash';
import routes from 'src/config/routes';

export default function findRouteByPath(pathToFind, options = {}) {

  // matchPath uses the same matching that react router's <Route> uses
  return _.find(routes, ({ path, exact = true }) => matchPath(pathToFind, {
    path,
    exact,
    strict: false,
    ...options
  })) || {};

}
