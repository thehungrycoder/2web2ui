export const formFocus = (action) => ({
  event: 'Interactions',
  category: 'Form',
  action: 'Focus',
  label: action.meta.form
});
export const formChange = (action) => ({
  event: 'Interactions',
  category: 'Form',
  action: 'Change',
  label: action.meta.field
});
export const formSubmitSuccess = (action) => ({
  event: 'Interactions',
  category: 'Form',
  action: 'Submit Success',
  label: action.meta.form,
  value: 1
});

export const formSubmitFailed = (action) => ({
  event: 'Interactions',
  category: 'Form',
  action: 'Submit Failure',
  label: action.meta.form,
  value: 0
});
