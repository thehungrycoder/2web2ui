import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { precancel } from 'src/actions/brightback';
import { selectBrightbackData } from 'src/selectors/brightback';

export class Brightback extends Component {
  componentDidMount() {
    const { precancel, data } = this.props;
    precancel(data);
  }

  getRenderProps() {
    const { enabled, valid, url } = this.props;

    if (enabled && valid) {
      return {
        buttonProps: {
          to: url,
          type: 'button' // This overwrites 'submit' which triggers redux-form submit
        }
      };
    }

    return {};
  }

  render() {
    return this.props.render(this.getRenderProps());
  }
}

const mapStateToProps = (state) => ({
  valid: state.brightback.valid,
  url: state.brightback.url,
  data: selectBrightbackData(state),
  loading: state.brightback.precancelLoading
});
export default withRouter(connect(mapStateToProps, { precancel })(Brightback));
