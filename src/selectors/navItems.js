import { createSelector } from 'reselect';
import _ from 'lodash';
import routes from 'src/config/routes';
import navItems from 'src/config/navItems';
import accountNavItems from 'src/config/accountNavItems';
import selectAccessConditionState from './accessConditionState';
import { all } from 'src/helpers/conditions/compose';

export const mapNavToRoutes = _.memoize((items) => {
  const routesByPath = _.keyBy(routes, 'path');
  return items.map((item) => {
    item.route = routesByPath[item.to];
    if (item.children) {
      item = { ...item, children: mapNavToRoutes(item.children) };
    }
    return item;
  });
});

export function filterNavByAccess(items, accessConditionState) {
  const firstLevelFiltered = items.filter((item) => {
    const allowed = () => true;
    const navCondition = _.get(item, 'condition', allowed);
    const routeCondition = _.get(item, 'route.condition', () => true);
    return all(navCondition, routeCondition)(accessConditionState);
  });

  const childrenFiltered = firstLevelFiltered.map((item) => {
    if (item.children) {
      item = { ...item, children: filterNavByAccess(item.children, accessConditionState) };
    }
    return item;
  });

  return childrenFiltered.filter((item) => !item.children || item.children.length);
}

export function prepareNavItems(items, accessConditionState) {
  const mapped = mapNavToRoutes(items);
  return filterNavByAccess(mapped, accessConditionState);
}

export const selectNavItems = createSelector(
  [selectAccessConditionState],
  (accessConditionState) => prepareNavItems(navItems, accessConditionState)
);

export const selectAccountNavItems = createSelector(
  [selectAccessConditionState],
  (accessConditionState) => prepareNavItems(accountNavItems, accessConditionState)
);
