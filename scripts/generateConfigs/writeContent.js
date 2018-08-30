const fs = require('fs');
const paths = require('../../config/paths');

const writeContent = (host, content) => {
  const dir = `${paths.appBuild}/static/tenant-config/${host}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(`${dir}/production.js`, content);
}

module.exports = writeContent;
