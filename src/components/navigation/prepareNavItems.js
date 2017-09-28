import routes from 'src/config/routes';
import navItems from './navItems';
import _ from 'lodash';
import config from 'src/config';

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

export function filterNavByAccess(items, store) {
  return items.filter((item) => {
    const condition = _.get(item, 'route.condition');

    // if condition function returns false, block access here
    if (typeof condition === 'function' && !condition({ store, config })) {
      return false;
    }

    // do the filter process on children, if they exist
    if (item.children) {
      item.children = filterNavByAccess(item.children, store);

      // if all children are eliminated by access, remove this parent too
      if (item.children.length === 0) {
        return false;
      }
    }

    return true;
  });
}

export default function prepareNavItems(store) {
  return filterNavByAccess(mapNavToRoutes(navItems), store);
}
