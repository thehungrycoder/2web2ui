import React from 'react';
import { connect } from 'react-redux';
import { Page, Panel, Button } from '@sparkpost/matchbox';
import NotificationCenter from 'src/components/notifications/NotificationCenter';
import { addNotification } from 'src/actions/notifications';

const NotificationTestPage = (props) => (
  <Page title='Notification Center Test Page'>
    <Panel sectioned style={{ textAlign: 'right' }}><NotificationCenter /></Panel>
    <Panel sectioned>
      <Button onClick={() => {
        const now = new Date();
        return props.addNotification({
          component: () => <p>This is a new random notification at {now.toString()}</p>,
          meta: {
            title: `A new notification ${now.toString()}`,
            activeDate: now,
            type: 'info'
          }
        });
      }}>+ Add a notification</Button>
    </Panel>
    <div style={{ height: '600px' }} />
  </Page>
);

export default connect(null, { addNotification })(NotificationTestPage);
