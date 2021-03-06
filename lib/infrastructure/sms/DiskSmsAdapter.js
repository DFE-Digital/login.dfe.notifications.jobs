const SmsAdapter = require('./SmsAdapter');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const smsUtils = require('./utils');

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

  dir = path.join(dir, 'sms');
  await makeDirectory(dir);

  dir = path.join(dir, template);
  await makeDirectory(dir);

  return dir;
};
const writeData = async (destination, content) => {
  const writeFile = promisify(fs.writeFile);
  await writeFile(destination, content);
};
const writeRenderedDataContentType = async (name, destination, contentTypes) => {
  const type = contentTypes.find(item => item.type.toLowerCase() === name.toLowerCase());
  if (!type) {
    return;
  }

  await writeData(destination, type.content);
};

class DiskEmailAdapter extends SmsAdapter {
  constructor(config) {
    super();

    this.renderContent = false;
    if (config && config.notifications && config.notifications.sms && config.notifications.sms.params) {
      this.renderContent = config.notifications.sms.params.renderContent
    }
  }

  async send(recipient, template, data, subject) {
    const dirPath = await ensureDirectory(template);

    const dataFileName = smsUtils.makeFileName();
    const content = smsUtils.getFileContent(recipient, template, data, subject);
    await writeData(path.join(dirPath, dataFileName), content);

    if (this.renderContent) {
      const renderedContent = await smsUtils.renderSmsContent(template, data);
      const renderedFileNameWithoutExt = dataFileName.substr(0, dataFileName.length - 5);
      await writeRenderedDataContentType('html', path.join(dirPath, `${renderedFileNameWithoutExt}.html`), renderedContent);
      await writeRenderedDataContentType('text', path.join(dirPath, `${renderedFileNameWithoutExt}.txt`), renderedContent);
    }
  }
}

module.exports = DiskEmailAdapter;
