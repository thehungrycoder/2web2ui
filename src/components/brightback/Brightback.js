import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { prepBrightback } from 'src/actions/brightback';
import { selectBrightbackData } from 'src/selectors/brightback';
import { hasUiOption } from 'src/helpers/conditions/account';
import BrightbackPropTypes from './Brightback.propTypes';

export class Brightback extends Component {
  componentDidMount() {
    const { data, prepBrightback, hasBrightbackOption } = this.props;

    if (hasBrightbackOption) {
      prepBrightback(data);
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

Brightback.propTypes = BrightbackPropTypes;

const mapStateToProps = (state, props) => ({
  valid: state.brightback.valid,
  url: state.brightback.url,
  data: selectBrightbackData(state, props),
  hasBrightbackOption: hasUiOption('brightback')(state)
});
export default withRouter(connect(mapStateToProps, { prepBrightback })(Brightback));
