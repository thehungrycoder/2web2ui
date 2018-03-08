import { selectSearchInitialValues } from '../suppressions';

describe('Selector: suppressions', () => {

  it('should select initial values for the suppressions search form', () => {
    const store = {
      suppressions: {
        search: {
          types: ['typeA', 'typeB', 'typeC'],
          sources: ['source1', 'source2']
        }
      }
    };
    expect(selectSearchInitialValues(store)).toEqual({
      types: {
        typeA: true,
        typeB: true,
        typeC: true
      },
      sources: {
        source1: true,
        source2: true
      }
    });
  });

});
