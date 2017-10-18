import sortMatch, { objectSortMatch } from '../sortMatch';
import _ from 'lodash';

describe('Helper: sortMatch', () => {

  let testList;
  let titleGetter;

  beforeEach(() => {
    testList = [
      { title: 'Moby Dick', author: 'Herman Melville' },
      { title: 'Hamlet', author: 'William Shakespeare' },
      { title: 'don quixote', author: 'Not Real' },
      { title: 'Don Quixote', author: 'Miguel de Cervantes' },
      { title: 'Again with Don Quixote', author: 'Miguel de Cervantes' },
      { title: 'Ulysses', author: 'James Joyce' },
      { title: 'the odyssey in tweets', author: '@Homer' },
      { title: 'The Odyssey', author: 'Homer' },
      { title: 'War and Peace', author: 'Leo Tolstoy' },
      { title: 'The Adventures of Huckleberry Finn', author: 'Mark Twain' },
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' }
    ];
    titleGetter = (book) => book.title;
  })

  it('should prefer exact case-sensitive matches', () => {
    const sorted = sortMatch(testList, 'Don Quixote', titleGetter);
    expect(sorted[0]).toBe(_.find(testList, { title: 'Don Quixote' }));
  });

  it('should prefer exact case-insensitive matches', () => {
    const sorted = sortMatch(testList, 'the odyssey', titleGetter);
    expect(sorted[0]).toBe(_.find(testList, { title: 'The Odyssey' }));
  });

  it('should prefer case-sensitive prefixes', () => {
    const sorted = sortMatch(testList, 'Don', titleGetter);
    expect(sorted[0]).toBe(_.find(testList, { title: 'Don Quixote' }));
  });

  describe('object match', () => {

    it('should match objects as the highest match', () => {
      const sorted = objectSortMatch({
        items: testList,
        pattern: 'author:"Mark Twain"',
        getter: titleGetter
      });
      expect(sorted[0].title).toEqual('The Adventures of Huckleberry Finn');
    });

  });

});
