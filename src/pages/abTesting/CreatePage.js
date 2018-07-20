import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { TextFieldWrapper, CheckboxWrapper, RadioGroup } from 'src/components';
import { Label, Page, Panel, UnstyledLink, Button, Popover, ActionList, TextField, Grid, Radio } from '@sparkpost/matchbox';
import { Typeahead } from 'src/components/typeahead/Typeahead';
import { formatDateTime } from 'src/helpers/date';
import { slugify } from 'src/helpers/string';

class CreatePage extends Component {

  handleIdFill = (e) => {
    const { change } = this.props;

    const idValue = slugify(e.target.value).replace(new RegExp('[^a-z0-9_-]', 'g'), '');
    change('id', idValue);
  }

  render() {
    return (
      <Page breadcrumbAction={{ content: 'Back to A/B Tests', component: Link, to: '/ab-testing'}}>
        <Panel
          title='Create a New A/B Test'
          actions={[{ content: 'Learn more about A/B tests', color: 'orange' }]}
          >
          <Panel.Section>
            <p>Give your test a name and an ID. You will need to use this ID when specifying an A/B test in your transmission's content JSON object.</p>
            <Grid>
              <Grid.Column>
                <Field
                  name='name'
                  component={TextFieldWrapper}
                  label='Give your test a name'
                  onChange={this.handleIdFill} />
              </Grid.Column>
              <Grid.Column>
                <Field
                  name='id'
                  component={TextFieldWrapper}
                  label='ID'
                  // helpText={`A Unique ID for your test, we\'ll fill this in for you.`}
                />
              </Grid.Column>
            </Grid>
          </Panel.Section>
          <Panel.Section>
            <Typeahead
              placeholder='Type to search'
              name='default_variant'
              results={['template-1', 'template-2']}
              label={'Select this test\'s default template'}
              helpText={<span>We will send this template by default when the test is not running. If you need to create a new template, <UnstyledLink to='#'>head over to the templates page</UnstyledLink>.</span>}/>
              <p></p>
          </Panel.Section>
          <Panel.Section>

            <Button color='orange'>Create New Test</Button>

          </Panel.Section>
        </Panel>
      </Page>
    )
  }
}

const mapStateToProps = (state) => ({
  formValues: getFormValues('abTestForm')(state),
  initialValues: {
  }
});

const formOptions = { form: 'abTestForm', enableReinitialize: true };
export default connect(mapStateToProps, { })(reduxForm(formOptions)(CreatePage));

// render() {
//   return (
//     <Page
//       title='Create a New Test'
//       breadcrumbAction={{ content: 'Back to AB Tests', component: Link, to: '/ab-testing'}}
//       primaryAction={{ content: this.props.formValues.skip_time ? 'Save Test as Draft' : 'Schedule Test' }}
//       secondaryActions={[{ content: 'Learn more about creating AB Tests' }]}>
//       <Grid>
//         <Grid.Column xs={6}>
//           <Panel>
//             <Panel.Section>
//               <Field
//                 name='name'
//                 component={TextFieldWrapper}
//                 label='Give your test a name'
//                 onChange={this.handleIdFill} />
//
//               <Field
//                 name='id'
//                 component={TextFieldWrapper}
//                 label='ID' helpText={`A Unique ID for your test, we\'ll fill this in for you.`}
//               />
//             </Panel.Section>
//           </Panel>
//
//           <Panel sectioned>
//             {(!this.props.formValues.skip_time) &&
//               <React.Fragment>
//                 <Label label='Schedule when your test will start and end'/>
//                 <DatePicker
//                   disabled={this.props.formValues.skip_time}
//                   from={new Date('2018-06-01T18:50:32.533Z')}
//                   to={new Date('2018-07-02T18:50:32.533Z')}/>
//                 <br/>
//               </React.Fragment>
//             }
//
//             <Field
//               label='Skip scheduling for now'
//               name='skip_time'
//               type='checkbox'
//               component={CheckboxWrapper} />
//           </Panel>
//
//           <Panel>
//             <Panel.Section>
//               <Field name='testmode' component={RadioGroup} label='Select a Test Mode' options={[
//                 { label: 'Bayesian Mode', value: 'bayesian', helpText: 'Once the test completes, the best performing template will be used in subsequent transmissions in place of the default.'},
//                 { label: 'Learning Mode', value: 'learning', helpText: 'Once the test completes, the default template will be used in subsequent transmissions.' }
//               ]} />
//             </Panel.Section>
//               {
//                 this.props.formValues.testmode === 'bayesian' && (
//                   <Panel.Section>
//                     <Field name='confidence_level' component={TextFieldWrapper} label='Confidence Level' helpText='Specify a confidence level at which point the test should end' />
//                   </Panel.Section>
//                 )
//               }
//
//           </Panel>
//
//           <Panel>
//             <Panel.Section>
//               <Field name='engagement_metric' grid={{ xs: 6 }} component={RadioGroup} label='Select a metric to use to measure engagement' options={[
//                 { label: 'Use Clicks', value: 'clicks' },
//                 { label: 'Use Opens', value: 'open' }
//               ]} />
//
//               <Field name='engagement_timeout' component={TextFieldWrapper} label='Engagement Timeout' helpText='The amount of time, in hours, until the lack of an engagement event is counted as a failure.' suffix='hours'/>
//             </Panel.Section>
//             <Panel.Section>
//
//               <Field name='audience_selection' grid={{ xs: 6 }} component={RadioGroup} label='Audience Distribution Method' options={[
//                 { label: 'Percent', value: 'percent' },
//                 { label: 'Sample Size', value: 'sample_size' }
//               ]} />
//               {
//                 this.props.formValues.audience_selection === 'sample_size' && (
//                     <Field name='sample_size' component={TextFieldWrapper} label='Total Sample Size' helpText='Total number of messages to send as part of the test' />
//                 )
//               }
//             </Panel.Section>
//           </Panel>
//
//
//
//         </Grid.Column>
//         <Grid.Column xs={6}>
//

//         </Grid.Column>
//
//       </Grid>
//     </Page>
//   );
// }
