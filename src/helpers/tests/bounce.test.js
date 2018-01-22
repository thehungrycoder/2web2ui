import * as bounce from '../bounce';

it('Should format aggregates', () => {
  const aggregates = {};
  aggregates['count_bounce'] = 0;
  expect(bounce.formatAggregates(aggregates)).toEqual({ countBounce: 0 });
});

it('Should reshape categories', () => {
  const categories = [
    {
      bounce_category_name: 'cat 1',
      bounce_class_name: 1,
      bounce_class_description: 1,
      count_bounce: 1
    },
    {
      bounce_category_name: 'cat 2',
      bounce_class_name: 2,
      bounce_class_description: 2,
      count_bounce: 2
    },
    {
      bounce_category_name: 'cat 2',
      bounce_class_name: 3,
      bounce_class_description: 3,
      count_bounce: 3
    }
  ];
  expect(bounce.reshapeCategories(categories)).toMatchSnapshot();
});

it('Should get band types from aggregates', () => {
  const aggregates = {
    countInbandBounce: 1,
    countOutofbandBounce: 2
  };
  expect(bounce.getBandTypes(aggregates)).toMatchSnapshot();
});
