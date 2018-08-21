import { createSelector } from 'reselect';
import config from 'src/config';

export const selectBrightbackReady = (state) => true;

export const selectBrightbackData = (state) => {
  const { customer_id } = state.account;
  const { username, first_name, last_name, email, customer, created } = state.currentUser;

  return {
    ...config.brightback.data,
    email,
    first_name,
    last_name,
    display_name: `${first_name} ${last_name}`,
    account: {
      created_at: created, // User created or account created??
      internal_id: customer_id
    }
  }
}

// From config
// app_id: 'APP_ID', // Identifies Brightback’s customer and is provided by Brightback
// save_return_url: 'https://customer-domain.com/account/', // Return URL from Brightback for end-users who do not cancel
// cancel_confirmation_url: 'https://customer-domain.com/account/cancel', // Return URL from Brightback for end-users who cancel
// billing_url: 'https://<you.com/account/billing', // Billing URL to direct end-users to enter coupon code or other billing changes

// From account
// first_name: 'Guy', // First Name
// last_name: 'Marion', // First Name
// display_name: 'Guy Marion', // Display Name
// email: 'guy@brightback.com', // Admin email
// image_url: 'https://customer-domain.com/avatars/guymarion.jpg', // Admin profile image
// account: {
//   company_name: 'Brightback', // Display name of company for end-user facing content
//   company_domain: 'brightback.com', // Used for display and data enrichment
//   internal_id: '1234AZ55', // End-user account ID (where end user is your customer)
//   created_at: 1312182000 // Timestamp of account created date

// From metrics?
// custom: {
//   activity: {
//     leads: 86, // For loss aversion card, with data values populated via a back-end rollup field
//     emails: 18046, // For loss aversion card; data values populated via a back-end rollup
//     contacts: 102546, // For loss aversion card; data values populated via a back-end rollup
//   },

// From users list? Can we send email instead of names?
//   team: [{
//     first_name: 'Alex', // For loss aversion card; first name of an account user
//     image_url: 'https://customer-domain.com/avatars/alex.jpg' // For loss aversion card; display URL of user profile image
//   }, {
//     first_name: 'Nathan', // For loss aversion card; first name of an account user
//     image_url: 'https://customer-domain.com/avatars/nathn.jpg' // For loss aversion card; display URL of user profile image
//   }, {
//     first_name: 'Jim', // For loss aversion card; first name of an account user
//     image_url: 'https://customer-domain.com/avatars/jim.jpg' // For loss aversion card; display URL of user profile image
//   }, {
//     first_name: 'Taylor', // For loss aversion card; first name of an account user
//     image_url: 'https://customer-domain.com/avatars/taylor.jpg' // For loss aversion card; display URL of user profile image
//   }]
// },
// segment: { // custom segment for targeting modals, optionally to supplement or replace the Brightback segment builder
//   somevar1: 'blah' // customizable variable used for segmentation or future identification of exit experience
// }
