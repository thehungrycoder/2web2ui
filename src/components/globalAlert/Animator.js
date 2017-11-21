import React, { Component } from 'react';
import cx from 'classnames';
import Transition from 'react-transition-group/Transition';

import styles from './Animator.module.scss';

class Animator extends Component {
  render() {
    const { children, in: inProp } = this.props;

    const transitionFn = (state) => {
      const classes = cx(styles.Animator, state && styles[state]);
      let height = 'auto';

      if (this.node && state === 'exiting') {
        height = this.node.getBoundingClientRect().height;
      }

      return (
        <div className={classes} style={{ height }} ref={(node) => this.node = node}>
          { children }
        </div>
      );
    };

    return (
      <Transition in={inProp} timeout={{ enter: 150, exit: 100 }}>
        {transitionFn}
      </Transition>
    );
  }
}

export default Animator;
