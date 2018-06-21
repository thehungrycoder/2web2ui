import React from 'react';
import { setupForm } from './helpers';
import WebhookCreatePage from 'src/pages/webhooks/CreatePage';
import axios from 'axios';
const axiosMock = axios.create();

test('Create Webhook: Defaults', async () => {
  const form = await setupForm(<WebhookCreatePage />);

  form.fill({
    name: 'Webhook Test Name',
    target: 'https://target.webhooks.com/status/200'
  });

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Create Webhook: Selected Events', async () => {
  const form = await setupForm(<WebhookCreatePage />);

  form.fill({
    name: 'Webhook Test Name',
    target: 'https://target.webhooks.com/status/200',
    eventsRadio: {
      type: 'radio',
      value: 'select' // switches eventsRadio to "select" to reveal top-level event groups
    }
  });

  form.toggleCheckbox({ id: 'event-group__message_event' }); // check the message events group, which selects all in that group by default
  form.toggleCheckbox('message_event[1]'); // uncheck delivery
  form.toggleCheckbox('message_event[2]'); // uncheck injection
  form.toggleCheckbox('message_event[3]'); // uncheck sms_status
  form.toggleCheckbox('message_event[5]'); // uncheck out_of_band
  form.toggleCheckbox('message_event[6]'); // uncheck policy_rejection
  form.toggleCheckbox('message_event[7]'); // uncheck delay

  // form.find('Field').at(3).find('input').map((o) => console.log(o.props().name, o.props().value))

  // form.fill([
  //   { name: 'name', value: 'Webhook Test Name' },
  //   {
  //     name: 'eventsRadio',
  //     type: 'radio',
  //     value: 'select'
  //   },
  //   {
  //     name: 'message_events[0]',
  //     type: 'checkbox',
  //     checked: true
  //   }
  // })

  // Uncheck all the events in the above group except "bounce" and "spam_complaint"
  // const eventCheckboxes = form.mounted.find('Field').at(3).find('input[type="checkbox"]');
  // eventCheckboxes.forEach((checkbox) => {
  //   const { value } = checkbox.props();
  //   if (!value) return; // top-level checkbox is still in this group, don't touch
  //   if (!['bounce', 'spam_complaint'].includes(value)) {
  //     checkbox.simulate('change', { target: { checked: false }});
  //   }
  // });

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

// test('Create Webhook: With Authentication', async () => {
//   const form = await setupForm(<WebhookCreatePage />);

//   form.fill([
//     'Webhook Test Name',
//     'https://target.webhooks.com/status/200'
//   ]);

//   axiosMock.mockClear();
//   await form.submit();
//   expect(axiosMock.mock.calls).toMatchSnapshot();
// });

// test('Create Webhook: Assigned to Master Account', async () => {
//   const form = await setupForm(<WebhookCreatePage />);

//   form.fill([
//     'Webhook Test Name',
//     'https://target.webhooks.com/status/200'
//   ]);

//   axiosMock.mockClear();
//   await form.submit();
//   expect(axiosMock.mock.calls).toMatchSnapshot();
// });

// test('Create Webhook: Assigned to a Subaccount', async () => {
//   const form = await setupForm(<WebhookCreatePage />);

//   form.fill([
//     'Webhook Test Name',
//     'https://target.webhooks.com/status/200'
//   ]);

//   axiosMock.mockClear();
//   await form.submit();
//   expect(axiosMock.mock.calls).toMatchSnapshot();
// });
