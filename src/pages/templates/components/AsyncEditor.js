import loadable from 'react-loadable';
import LoadableLoading from 'src/components/loading/LoadableLoading';

export const LoadableEditor = loadable({
  loader: () => import('./Editor'),
  loading: LoadableLoading
});

export default LoadableEditor;
