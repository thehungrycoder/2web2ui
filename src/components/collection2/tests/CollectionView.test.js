import React from 'react';
import { shallow } from 'enzyme';
import CollectionView from '../CollectionView';
import { mkRows } from '../__testHelpers__/rows';

describe('Component: CollectionView', () => {
  let props;

  beforeEach(() => {
    props = {
      rows: [],
      rowComponent: () => <h1>row</h1>,
      headerComponent: () => <h1>header</h1>
    };
  });

  it('should render null if there are no rows', () => {
    const wrapper = shallow(<CollectionView {...props} />);
    expect(wrapper.equals(null)).toEqual(true);
  });

  it('should render correctly with basic props', () => {
    const wrapper = shallow(<CollectionView {...props} rows={mkRows(15)} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom wrappers', () => {
    props.outerWrapper = function CustomOuterWrapper(props) { return props.children; };
    props.bodyWrapper = function CustomBodyWrapper(props) { return props.children; };
    expect(shallow(<CollectionView {...props} rows={mkRows(3)} />)).toMatchSnapshot();
  });
});
