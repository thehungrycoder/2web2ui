const prettier = require('prettier');

const constructContent = ({ alias, host, nextHost, originHost, tenantId, ...config }) => {
  const content = `
    window.SP = window.SP || {};
    window.SP.productionConfig = ${JSON.stringify(config)};
  `;

  return prettier.format(content, { parser: 'babylon', singleQuote: true });
}

module.exports = constructContent;
