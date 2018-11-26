import faker from 'faker';
import { collection } from 'faker-structures';
import moment from 'moment';

const healthScoreData = collection({
  item: faker.internet.domainName,
  data: () => {
    let count = 0;

    return (
      collection({
        // Must be ISO 8601
        // what is the percision? daily, hourly, etc.
        date: () => moment('2018-01-01').add(count++, 'd').format('YYYY-MM-DD'),

        //
        value: () => faker.random.number({ min: 50, max: 100 })
      })(14)
    );
  },

  // Is this the difference between last day
  percentChange: () => faker.random.number({ min: 0, max: 25 })
});

export default healthScoreData;
