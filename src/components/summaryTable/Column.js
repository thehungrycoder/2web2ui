import PropTypes from 'prop-types';

// This component is only used to collect props
const Column = () => null;

Column.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func
  ]),
  dataKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  sortable: PropTypes.bool,
  width: PropTypes.string
};

export default Column;
