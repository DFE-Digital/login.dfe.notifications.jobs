const { getTemplateFormats } = require('./../templates');

const makeFileName = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth().toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const second = now.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hour}-${minute}-${second}.json`;
};

const getFileContent = (recipient, template, data, subject) =>
  JSON.stringify({
    recipient,
    template,
    data,
    subject
  });

const renderSmsContent = async (template, data) => {
  const templateFormats = await getTemplateFormats(template);
  const smsTemplate = templateFormats.find(item => item.type === 'sms');
  if (!smsTemplate) {
    throw new Error('No sms format supported');
  }

  return smsTemplate.contentTypes.map(contentType => {
    return {
      type: contentType.name,
      content: smsTemplate.render(contentType, data),
    };
  });
};

module.exports = {
  makeFileName,
  getFileContent,
  renderSmsContent,
};
