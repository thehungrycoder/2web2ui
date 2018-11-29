import PropTypes from 'prop-types';

export default {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  enabled: PropTypes.bool.isRequired,
  onEnable: PropTypes.func.isRequired
};
