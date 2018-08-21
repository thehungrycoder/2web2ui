import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { precancel } from 'src/actions/brightback';
import { selectBrightbackData, selectBrightbackReady } from 'src/selectors/brightback';

export class Brightback extends Component {
  componentDidMount() {
    // Retrieve any information to pass on to Brightback here

    this.props.precancel(this.props.data);
  }

  // This is only needed if we need to wait for data before precancel
  // componentDidUpdate({ ready: prevReady }) {
  //   const { ready, precancel, data } = this.props;
  //
  //   if (!prevReady && ready) {
  //     console.log('ready for precancel')
  //     precancel(data);
  //   }
  // }

  handleBrightbackRedirect = () => {
    const { history, url } = this.props;
    console.log('handling brightback redirect');

    // Redirect to a url brightback provides
    // history.push(url);
  }

  getRenderProps() {
    const { enabled, valid } = this.props;
    console.log({ enabled, valid })
    if (enabled && valid) {
      return {
        buttonProps: {
          onClick: this.handleBrightbackRedirect,
          type: 'button' // This overwrites 'submit' which triggers redux-form submit
        }
      }
    }

    return {}
  }

  render() {
    return this.props.render(this.getRenderProps());
  }
}

const mapStateToProps = (state) => ({
  valid: state.brightback.valid,
  url: state.brightback.url,
  ready: selectBrightbackReady(state), // TODO determine if all data is ready for precancel check
  data: selectBrightbackData(state)
});
export default withRouter(connect(mapStateToProps, { precancel })(Brightback));
