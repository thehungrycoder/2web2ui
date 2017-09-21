## PlanPicker Usage

In a redux-form connected component, pass through `subscription` and `pending_subscription` from the `account` store.
```
<PlanPicker
  subscription={account.subscription}
  pendingSubscription={account.pending_subscription}
  plans={plans} />
```

Selected plan value will be available in the redux-form store:
```
 form: {
   'your-form-name': {
     values: {
       planpicker: {}
     }
   }
 }
```

To set initial plan, pass the plan object through mapStateToProps. EG:
```
const mapStateToProps = (state) => ({
  initialValues: {
    planpicker: _.find(state.billing.plans, { code: 'free' })
  }
});

const formOptions = {
  form: 'your-form-name',
  enableReinitialize: true
};
export default connect(mapStateToProps, {})(reduxForm(formOptions)(YourPage));
```
