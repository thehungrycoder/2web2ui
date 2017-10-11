import { createSelector } from 'reselect';
import _ from 'lodash';
import routes from 'src/config/routes';
import navItems from 'src/config/navItems';
import accessConditionState from './accessConditionState';

const routesByPath = _.keyBy(routes, 'path');

export function mapNavToRoutes(items) {
  return items.map((item) => {
    item.route = routesByPath[item.to];
    if (item.children) {
      item.children = mapNavToRoutes(item.children);
    }
    return item;
  });
}

export function filterNavByAccess(items, accessConditionState) {
  return items.filter((item) => {
    const condition = _.get(item, 'route.condition');

    // if condition function returns false, block access here
    if (typeof condition === 'function' && !condition(accessConditionState)) {
      return false;
    }

    // do the filter process on children, if they exist
    if (item.children) {
      item.children = filterNavByAccess(item.children, accessConditionState);

      // if all children are eliminated by access, remove this parent too
      if (item.children.length === 0) {
        return false;
      }
    }

    return true;
  });
}

export function prepareNavItems(accessConditionState) {
  console.log('preparing nav items'); // eslint-disable-line
  return filterNavByAccess(mapNavToRoutes(navItems), accessConditionState);
}

export default createSelector([accessConditionState], prepareNavItems);
