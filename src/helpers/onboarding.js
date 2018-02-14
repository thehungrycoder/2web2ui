import config from 'src/config';

export function getTransmissionsUri() {
  const configUri = `${config.apiBase}/api/v1/transmissions`;

  // if config uri is protocol-relative, prepend window protocol
  if (/^\/\//.test(configUri)) {
    return window.location.protocol + configUri;
  }

  return configUri;
}

export function curlRequest({ apiKey, email }) {
  return `curl -X POST
  ${getTransmissionsUri()}
  -H "Authorization: ${apiKey}"
  -H "Content-Type: application/json"
  -d '{
    "options": {
      "sandbox": true
    },
    "content": {
      "from": "sandbox@sparkpostbox.com",
      "subject": "Thundercats are GO!!!",
      "text": "Sword of Omens, give me sight BEYOND sight"
    },
    "recipients": [{ "address": "${email}" }]
}'`;
}
