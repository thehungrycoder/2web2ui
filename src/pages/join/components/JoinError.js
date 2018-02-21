import React from 'react';
import { LINKS } from 'src/constants';
import { UnstyledLink } from '@sparkpost/matchbox';


function createSupportLink(data) {
  return LINKS.SUBMIT_SUPPORT_TICKET + encodeURI(`?interaction[name]=${data.first_name} ${data.last_name}&interaction[email]=${data.email}&email[subject]=Account requires manual review`);
}

export default function JoinError({ errors, data }) {
  let status;
  let message;

  const genericError = <span>Something went wrong. Please try again in a few minutes or <UnstyledLink to={LINKS.SUBMIT_SUPPORT_TICKET}>contact
      support</UnstyledLink></span>;

  try {
    message = errors.response.data.errors[0].message;
    status = errors.response.status;
  } catch (e) {
    return genericError;
  }


  if (status === 400 && message.match(/\brecaptcha\b/i)) {
    return '<span>There was an error with your reCAPTCHA response, please try again.</span>';
  } else if ((status === 400 || status === 403) && message.match(/^invalid email/i)) {
    return '<span>Email address is not valid.</span>';
  } else if (status === 409 && message.match(/^AWS Account already exists/i)) {
    return '<span>It looks like you\'ve already created a SparkPost account through the AWS Marketplace. There may be a brief delay for your AWS account info to synchronize. Please wait a few minutes and then sign in.</span>';
  } else if (status === 409 && message.match(/\bemail\b/i)) {
    return <span>It looks like you already have a SparkPost account using {data.email}.&nbsp;
    <UnstyledLink to="/auth">Sign in</UnstyledLink>
    </span>;
  } else if (status === 403 && message.match(/^Sign up blocked/i)) {
    return <span>Your account requires manual review. To proceed with sign up, please <UnstyledLink
      to={createSupportLink(data)}>contact support</UnstyledLink>.</span>;
  } else if (status === 403 && message.match(/^forbidden/i)) {
    return '<span>SparkPost is not currently available in your location.</span>';
  } else {
    return genericError;
  }
}

