import React from 'react';
import { filteringModel, paginatingModel, fullModel } from './helpers/static';
import PaginatingCollection from './PaginatingCollection';
import { FilteringCollection } from './FilteringCollection';
import TableCollectionView from './TableCollectionView';

const FilteringPaginatingCollection = ({ collectionComponent, ...rest }) => <FilteringCollection
  collectionComponent={(props) => <PaginatingCollection {...props} collectionComponent={collectionComponent} />}
  {...rest} />;

const Collection = ({ rows, fetchRows, paginating, filtering, ...rest }) => {

  if (paginating && filtering) {
    const dataModel = rows ? fullModel(rows, rest.filterBox) : fetchRows;
    return <FilteringPaginatingCollection fetchRows={dataModel} {...rest} />;
  }

  if (paginating) {
    const dataModel = rows ? paginatingModel(rows) : fetchRows;
    return <PaginatingCollection fetchRows={dataModel} {...rest} />;
  }

  if (filtering) {
    const dataModel = rows ? filteringModel(rows, rest.filterBox) : fetchRows;
    return <FilteringCollection fetchRows={dataModel} {...rest} />;
  }

  const Coll = rest.collectionComponent || TableCollectionView;
  return <Coll rows={rows} {...rest} />;
};

export default Collection;
