import React from 'react';
import { UnstyledLink } from '@sparkpost/matchbox';
import { Check, ChevronRight } from '@sparkpost/matchbox-icons';
import styles from './SubaccountOption.module.scss';

class SubaccountOption extends React.Component {
  handleClick = () => {
    const { onChange, selected, value } = this.props;

    if (!selected) {
      onChange(value);
    }
  }

  render() {
    const { label, nested, onOpen, selected } = this.props;

    if (nested) {
      return (
        <UnstyledLink className={styles.Option} onClick={onOpen}>
          {label} <ChevronRight />
        </UnstyledLink>
      );
    }

    return (
      <UnstyledLink className={styles.Option} onClick={this.handleClick}>
        {label} {selected && <Check className={styles.Check} />}
      </UnstyledLink>
    );
  }
}

export default SubaccountOption;
