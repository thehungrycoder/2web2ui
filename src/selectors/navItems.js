import { createSelector } from 'reselect';
import _ from 'lodash';
import routes from 'src/config/routes';
import navItems from 'src/config/navItems';
import accessConditionState from './accessConditionState';

export const mapNavToRoutes = _.memoize((items) => {
  const routesByPath = _.keyBy(routes, 'path');
  return items.map((item) => {
    item.route = routesByPath[item.to];
    if (item.children) {
      item.children = mapNavToRoutes(item.children);
    }
    return item;
  });
});

export function filterNavByAccess(items, accessConditionState) {
  const firstLevelFiltered = items.filter((item) => {
    const condition = _.get(item, 'route.condition', () => true);
    return condition(accessConditionState);
  });

  const childrenFiltered = firstLevelFiltered.map((item) => {
    if (item.children) {
      item.children = filterNavByAccess(item.children, accessConditionState);
    }
    return item;
  });

  return childrenFiltered.filter((item) => !item.children || item.children.length);
}

export function prepareNavItems(accessConditionState) {
  const mapped = mapNavToRoutes(navItems);
  return filterNavByAccess(mapped, accessConditionState);
}

export default createSelector(
  [accessConditionState],
  prepareNavItems
);
