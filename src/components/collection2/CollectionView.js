import React, { Component } from 'react';
import CollectionViewPropTypes from './CollectionView.propTypes';
import { Loading } from 'src/components';

const PassThroughWrapper = (props) => props.children;
const NullComponent = () => null;

const defaultFormatRow = (row) => Object.keys(row).map((fieldName) => row[fieldName]);

class CollectionView extends Component {
  render() {
    const {
      rows,
      formatRow = defaultFormatRow,
      rowComponent: RowComponent,
      rowKeyName = 'id',
      headerComponent: HeaderComponent = NullComponent,
      outerWrapper: OuterWrapper = PassThroughWrapper,
      bodyWrapper: BodyWrapper = PassThroughWrapper
    } = this.props;

    if (!Array.isArray(rows)) {
      return <Loading />;
    }

    if (!rows.length) {
      return null; // nothing to display msg?
    }

    return <OuterWrapper>
      <HeaderComponent />
      <BodyWrapper>
        {rows.map((row, i) => <RowComponent key={`${row[rowKeyName] || 'row'}-${i}`} rowData={formatRow(row)} />)}
      </BodyWrapper>
    </OuterWrapper>;
  }
}

CollectionView.propTypes = CollectionViewPropTypes;

export default CollectionView;
