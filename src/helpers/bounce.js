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
        subcategories: [rest]
      });
    } else {
      categories[index].count = categories[index].count + rest.count;
      categories[index].subcategories.push(rest);
    }
  });

  return generateColors(_.orderBy(categories, ['count'], ['desc']), '#DB2F3D');
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
 * Generates a color palette for bounce chart data
 */
function generateColors(categories, base) {
  const baseColor = color(base);
  const rotate = 60 / categories.length;
  const saturate = 0.1 / categories.length;
  return categories.map(({ subcategories, ...category }, i) => ({
    ...category,
    fill: baseColor.rotate(rotate * i).saturate(saturate * i).string(),
    subcategories: subcategories && generateColors(subcategories, '#DB2F3D')
  }));
}

/**
 * Creates band type data for bounce chart from aggregates
 */
function getBandTypes({ countInbandBounce, countOutofbandBounce }) {
  return generateColors([
    { name: 'In-Band', count: countInbandBounce },
    { name: 'Out-of-Band', count: countOutofbandBounce }
  ], '#37aadc');
}

export {
  formatAggregates,
  reshapeCategories,
  generateColors,
  getBandTypes
};
