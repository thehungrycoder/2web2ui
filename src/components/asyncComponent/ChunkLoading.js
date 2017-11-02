import React from 'react';
import { Loading } from 'src/components/loading/Loading';

const ChunkLoading = ({ pastDelay }) => {
  // if loading has taken more than 200 milliseconds
  if (pastDelay) {
    return <Loading />;
  } else {
    return null;
  }
};

export default ChunkLoading;
