import { snakeToCamel } from 'src/helpers/string';
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

function formatAggregates(aggregates) {
  const map = {};
  _.each(aggregates, (value, key) => map[snakeToCamel(key.replace('count_', ''))] = value);
  return map;
}

function formatCategories(data) {
  const categories = [];
  const formatted = _.flatten(data).map((item) => formatSubcategory(item));

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

  return categories;
}

function formatSubcategory(classification) {
  const { bounce_category_name, bounce_class_name, bounce_class_description, count_bounce } = classification;
  return {
    category: bounce_category_name,
    name: bounce_class_name,
    description: bounce_class_description,
    count: count_bounce
  };
}

export {
  formatAggregates,
  formatCategories
};
