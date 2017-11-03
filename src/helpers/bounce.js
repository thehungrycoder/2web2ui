import { snakeToCamel } from 'src/helpers/string';
import color from 'color';
import _ from 'lodash';

/**
 * Camel cases aggregates
 */
function formatAggregates(aggregates) {
  const map = {};
  _.each(aggregates, (value, key) => map[snakeToCamel(key)] = value);
  return map;
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

/**
 * Reshapes results of getBounceClassifications for the bounce chart
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
        children: [rest]
      });
    } else {
      categories[index].count = categories[index].count + rest.count;
      categories[index].children.push(rest);
    }
  });

  return _.orderBy(categories, ['count'], ['desc']);
}

/**
 * Generates a color palette for bounce chart data
 */
function generateColors(arr, base) {
  const baseColor = color(base);
  const rotate = 60 / arr.length;
  const saturate = 0.1 / arr.length;
  return arr.map((item, i) => ({
    ...item,
    fill: baseColor.rotate(rotate * i).saturate(saturate * i).string()
  }));
}

/**
 * Creates band type data for bounce chart from aggregates
 */
function getBandTypes({ countInbandBounce, countOutofbandBounce }) {
  return [
    { name: 'In-Band', count: countInbandBounce },
    { name: 'Out-of-Band', count: countOutofbandBounce }
  ];
}

export {
  formatAggregates,
  reshapeCategories,
  generateColors,
  getBandTypes
};
