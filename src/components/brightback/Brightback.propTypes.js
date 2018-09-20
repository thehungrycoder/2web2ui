import PropTypes from 'prop-types';

export default {
  condition: PropTypes.bool,
  urls: PropTypes.shape({
    save_return_url: PropTypes.string.isRequired,
    cancel_confirmation_url: PropTypes.string.isRequired,
    billing_url: PropTypes.string.isRequired
  }),
  render: PropTypes.func.isRequired
};
