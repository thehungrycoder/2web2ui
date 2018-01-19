import asyncComponent from 'src/components/asyncComponent/asyncComponent';
import PanelLoading from 'src/components/panelLoading/PanelLoading';

export default asyncComponent(() => import('./async/EngagementChart'), PanelLoading);
