const fs = require('fs');

const writeContent = (host, content) => {
  const dir = `./build/static/tenant-config/${host}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(`${dir}/production.js`, content);
}

module.exports = writeContent;
