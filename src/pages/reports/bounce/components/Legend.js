import React from 'react';
import { Grid } from '@sparkpost/matchbox';
import LegendItem from './LegendItem';

import styles from './Legend.module.scss';

const Legend = ({
  headerData,
  primaryData,
  secondaryData,
  handleMouseOver,
  handleMouseOut,
  handleClick,
  hoveredItem
}) => {
  const hoveredDataSet = hoveredItem && hoveredItem.dataSet;

  const primaryLegend = primaryData.map((item, i) => (
    <LegendItem key={i}
      onMouseOver={() => handleMouseOver(item, 'primary')}
      onMouseOut={handleMouseOut}
      onClick={() => handleClick(item)}
      hovered={hoveredDataSet === 'primary' && hoveredItem.index === i}
      {...item} />
  ));

  const secondaryLegend = secondaryData
    ? <Grid.Column>
      {secondaryData.map((item, i) => (
        <LegendItem key={i}
          onMouseOver={() => handleMouseOver(item, 'secondary')}
          onMouseOut={handleMouseOut}
          onClick={() => handleClick(item)}
          hovered={hoveredDataSet === 'secondary' && hoveredItem.index === i}
          {...item} />
      ))}
    </Grid.Column>
    : null;

  const header = headerData.map((item, i) => <LegendItem key={i} {...item} />);

  return (
    <div>
      <div className={styles.LegendHeader}>{header}</div>
      <Grid>
        <Grid.Column>{primaryLegend}</Grid.Column>
        {secondaryLegend}
      </Grid>
    </div>
  );
};

export default Legend;
