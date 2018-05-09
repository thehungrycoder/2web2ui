export const labels = {
  previous_sending_domains: 'Please list any existing and previous non SparkPost sending domains.',
  previous_ips: 'Please list any existing and previous non SparkPost sending IPs.',
  acquisition_practices: 'What are your acquisition practices?',
  hygiene: 'What are your hygiene practices?',
  traffic_types: 'What are your traffic types? (marketing, newletters, e-commerce, transactional)',
  only_dedicated: 'Are you willing to only use dedicated IPs and no longer use the shared pools?',
  privacy_policy: 'Please provide the location of your privacy policy?',
  website: 'Please provide the location of your website?',
  sending_policy: 'If small service provider, please provide the location of your sending policy',
  terminated_from_esp: 'Have you been terminated as a customer from an ESP before?',
  current_issues: 'What are the current issues you would like to resolve or improve?'
};

export function generateMessage (values) {
  let message = '';

  for (const key in labels) {
    message = `${message}\n${labels[key]}\n${values[key] || ''}\n\n`;
  }

  return message;
}
