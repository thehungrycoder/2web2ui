import { snakeToCamel } from 'src/helpers/string';
import color from 'color';
import _ from 'lodash';

// function formatArray(arr) {
//   return arr.map((item) => formatKeys(item));
// }
//
// function formatKeys(obj) {
//   const map = {};
//   _.each(obj, (value, key) => map[snakeToCamel(key)] = value);
//   return map;
// }

/**
 * Formats keys of aggregate metrics
 * eg: count_soft_bounce -> softBounce
 */
function formatAggregates(aggregates) {
  const map = {};
  _.each(aggregates, (value, key) => map[snakeToCamel(key.replace('count_', ''))] = value);
  return map;
}

/**
 * Reshapes results of getBounceClassifications for the report page pie chart
 */
function reshapeCategories(data) {
  const categories = [];
  const formatted = _.flatten(data).map((item) => formatCategory(item));

  _.each(formatted, (item) => {
    const { category, ...rest } = item;
    const index = _.findIndex(categories, (o) => o.name === category);

    if (index === -1) {
      categories.push({
        name: category,
        count: rest.count,
        subcategories: [rest]
      });
    } else {
      categories[index].count = categories[index].count + rest.count;
      categories[index].subcategories.push(rest);
    }
  });

  return _.orderBy(categories, ['count'], ['desc']);
}

/**
 * Formats category objects from getBounceClassifications
 */
function formatCategory(classification) {
  const { bounce_category_name, bounce_class_name, bounce_class_description, count_bounce } = classification;
  return {
    category: bounce_category_name,
    name: bounce_class_name,
    description: bounce_class_description,
    count: count_bounce
  };
}

function generateColors(categories) {
  const base = color('#DB2F3D');
  return categories.map(({ subcategories, ...category }, i) => ({
    ...category,
    fill: base.rotate(12 * i).saturate(0.1 * i).string(),
    subcategories: subcategories && generateColors(subcategories)
  }));
}

export {
  formatAggregates,
  reshapeCategories,
  generateColors
};
