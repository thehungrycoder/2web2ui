import loadable from 'react-loadable';
import ChunkLoading from './ChunkLoading';


export default function asyncComponent(importComponent) {
  const LoadableComponent = loadable({
    loader: importComponent,
    loading: ChunkLoading
  });

  return LoadableComponent;
}
