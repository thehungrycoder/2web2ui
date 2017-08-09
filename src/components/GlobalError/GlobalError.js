import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { dismiss } from '../../actions/apiFailure';
import { Banner } from '@sparkpost/matchbox';

import styles from './GlobalError.module.scss';

class GlobalError extends Component {
  state = {
    show: false // Controls the .show css class
  }

  handleDismiss () {
    this.setState({ show: false });
    setTimeout(() => this.props.dismiss(), 400); // Wait for transition out before killing
  }

  componentWillReceiveProps () {
    if (this.props.error) {
      this.setState({ show: true });
    }
  }

  render () {
    const { error } = this.props;

    const classes = classnames(
      styles.GlobalError,
      this.state.show && styles.show
    );

    const title = 'Sorry, something went wrong.';
    const description = error
      ? `Error: ${error.message}`
      : null;

    return (
      <div className={classes}>
        <Banner
          title={title}
          onDismiss={() => this.handleDismiss()}
          status='danger'
          overlay >
          { description }
        </Banner>
      </div>
    );
  }
}

const mapStateToProps = ({ apiFailure: { error } }) => ({ error });
export default connect(mapStateToProps, { dismiss })(GlobalError);
