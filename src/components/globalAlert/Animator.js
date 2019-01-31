import React from 'react';
import cx from 'classnames';
import Transition from 'react-transition-group/Transition';

import styles from './Animator.module.scss';

class Animator extends React.Component {
  state = { node: null }

  transitionNode = (node) => {
    this.setState({ node });
  };

  render() {
    const { children, in: inProp } = this.props;
    return (
      <Transition in={inProp} timeout={{ enter: 150, exit: 100 }}>
        {(state) => {
          const classes = cx(styles.Animator, state && styles[state]);
          const height =
            this.state.node && state === 'exiting' ? this.state.node.getBoundingClientRect().height : 'auto';

          return (
            <div className={classes} style={{ height }} ref={this.transitionNode}>
              {children}
            </div>
          );
        }}
      </Transition>
    );
  }
}

export default Animator;
