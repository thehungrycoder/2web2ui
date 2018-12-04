import React from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { prepBrightback } from 'src/actions/brightback';
import { selectBrightbackData } from 'src/selectors/brightback';
import BrightbackPropTypes from './Brightback.propTypes';

export class Brightback extends React.Component {
  componentDidMount() {
    const { data, prepBrightback } = this.props;
    prepBrightback(data);
  }

  getRenderProps() {
    const { valid, url, condition = true } = this.props;

    if (valid && condition) {
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
  data: selectBrightbackData(state, props)
});
export default withRouter(connect(mapStateToProps, { prepBrightback })(Brightback));
