import WebhooksHome from './Webhooks/HomePage';
import WebhooksCreate from './Webhooks/CreatePage';
import WebhooksEdit from './Webhooks/EditPage';

const webhooks = {
  HomePage: WebhooksHome,
  CreatePage: WebhooksCreate,
  EditPage: WebhooksEdit
};

export { webhooks };
export * from './settings/Profile';
export * from './Dashboard';
export * from './Templates';
export { default as AuthPage } from './AuthPage';
export { default as SummaryReportPage } from './reports/SummaryPage';
export { default as TemplatesPage } from './Templates';
