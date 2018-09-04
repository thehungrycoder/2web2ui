import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { precancel } from 'src/actions/brightback';
import { selectBrightbackData } from 'src/selectors/brightback';
import { hasUiOption } from 'src/helpers/conditions/account';

export class Brightback extends Component {
  componentDidMount() {
    const { precancel, data, hasBrightbackOption } = this.props;

    if (hasBrightbackOption) {
      precancel(data);
    }
  }

  getRenderProps() {
    const { valid, url, hasBrightbackOption, condition = true } = this.props;

    if (hasBrightbackOption && valid && condition) {
      return {
        to: url,
        enabled: true
      };
    }

    return {};
  }

  render() {
    return this.props.render(this.getRenderProps());
  }
}

const mapStateToProps = (state, props) => ({
  valid: state.brightback.valid,
  url: state.brightback.url,
  data: selectBrightbackData(state, props),
  loading: state.brightback.precancelLoading,
  hasBrightbackOption: hasUiOption('brightback')(state)
});
export default withRouter(connect(mapStateToProps, { precancel })(Brightback));
