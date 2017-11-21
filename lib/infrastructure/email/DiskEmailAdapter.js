const EmailAdapter = require('./EmailAdapter');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const emailUtils = require('./utils');

const makeDirectory = async (dirPath) => {
  const mkdir = promisify(fs.mkdir);
  try {
    await mkdir(dirPath);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
};
const ensureDirectory = async (template) => {
  let dir = path.resolve('app_data');
  await makeDirectory(dir);

  dir = path.join(dir, 'email');
  await makeDirectory(dir);

  dir = path.join(dir, template);
  await makeDirectory(dir);

  return dir;
};
const writeData = async (destination, content) => {
  const writeFile = promisify(fs.writeFile);
  await writeFile(destination, content);
};

class DiskEmailAdapter extends EmailAdapter {
  async send(recipient, template, data, subject) {
    const dirPath = await ensureDirectory(template);
    const fileName = emailUtils.makeFileName();
    const content = emailUtils.getFileContent(recipient, template, data, subject);
    await writeData(path.join(dirPath, fileName), content);
  }
}

module.exports = DiskEmailAdapter;
