export default () => ({
  results: [
    {
      label: 'Event Webhooks: Read-only',
      description: 'Provides the GET grant for the Event Webhooks API.',
      key: 'webhooks/view'
    },
    {
      label: 'Event Webhooks: Read/Write',
      description: 'Provides GET, POST, PUT, and DELETE grants for the Event Webhooks API.',
      key: 'webhooks/modify'
    },
    {
      key: 'users/self-manage'
    },
    {
      key: 'users/manage'
    },
    {
      key: 'users/token-manage'
    }
  ]
});
