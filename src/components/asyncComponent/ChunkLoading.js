import React from 'react';
import { Loading } from 'src/components';

const ChunkLoading = ({ LoadingComponent = Loading, pastDelay }) => {
  // if loading has taken more than 200 milliseconds
  if (pastDelay) {
    return <LoadingComponent />;
  }

  return null;
};

export default ChunkLoading;
