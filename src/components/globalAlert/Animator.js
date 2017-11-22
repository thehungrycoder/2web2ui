import React from 'react';
import cx from 'classnames';
import Transition from 'react-transition-group/Transition';

import styles from './Animator.module.scss';

const Animator = ({
  children,
  in: inProp
}) => (
  <Transition in={inProp} timeout={{ enter: 150, exit: 100 }}>
    {(state) => {
      const classes = cx(styles.Animator, state && styles[state]);
      const height = this.node && state === 'exiting'
        ? this.node.getBoundingClientRect().height
        : 'auto';

      return (
        <div className={classes} style={{ height }} ref={(node) => this.node = node}>
          { children }
        </div>
      );
    }}
  </Transition>
);

export default Animator;
