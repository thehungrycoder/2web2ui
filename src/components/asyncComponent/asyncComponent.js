import React from 'react';
import loadable from 'react-loadable';
import ChunkLoading from './ChunkLoading';

export default function asyncComponent(importComponent, LoadingComponent) {
  const LoadableComponent = loadable({
    loader: importComponent,
    loading: (props) => <ChunkLoading LoadingComponent={LoadingComponent} {...props} />
  });

  return LoadableComponent;
}
