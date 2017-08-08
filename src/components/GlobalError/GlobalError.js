import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Banner } from '@sparkpost/matchbox';

import styles from './GlobalError.module.scss';

class GlobalError extends Component {
  state = {
    show: false
  }

  handleDismiss () {
    this.setState({ show: false });
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

    const title = 'Oh boy, shits on fire 🔥';
    const description = error ? error.message : null;

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
export default connect(mapStateToProps)(GlobalError);
