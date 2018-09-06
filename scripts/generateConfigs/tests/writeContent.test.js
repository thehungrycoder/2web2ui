const fs = require('fs');
const writeContent = require('../writeContent');

jest.mock('fs');
jest.mock('../../../config/paths', () => ({ appBuild: './build' }));

describe('generateConfigs.writeContent', () => {
  const content = `window.SP.productionConfig = { tenant: 'test' };`;
  const host = 'test.example.com';

  it('only writes content', () => {
    fs.existsSync.mockImplementationOnce(() => true);

    writeContent(host, content);

    expect(fs.existsSync).toHaveBeenCalledWith('./build/static/tenant-config/test.example.com');
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      './build/static/tenant-config/test.example.com/production.js',
      content
    );
  });

  it('makes directory and writes content', () => {
    writeContent(host, content);

    expect(fs.existsSync).toHaveBeenCalledWith('./build/static/tenant-config/test.example.com');
    expect(fs.mkdirSync).toHaveBeenCalledWith('./build/static/tenant-config/test.example.com');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      './build/static/tenant-config/test.example.com/production.js',
      content
    );
  });
});
