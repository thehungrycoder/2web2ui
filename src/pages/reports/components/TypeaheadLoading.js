import React from 'react';

import styles from './Typeahead.module.scss';
import { LoadingSVG } from '../../../components';

const TypeaheadLoading = ({ isCalculating }) => {
  const isLoading = (isCalculating) ? <LoadingSVG className = {styles.Logo} circleClassName = {styles.Circle}/> : null;
  return (
    <div>
      {isLoading}
    </div>
  );
};

export default TypeaheadLoading;
