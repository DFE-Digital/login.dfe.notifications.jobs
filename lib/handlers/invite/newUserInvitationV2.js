const { getEmailAdapter } = require('./../../infrastructure/email');
const { markdown } = require('markdown');

const parseMarkdownTreeToText = (element) => {
  let text = '';
  for (let i = 1; i < element.length; i++) {
    if (Array.isArray(element[i])) {
      text += parseMarkdownTreeToText(element[i]);
    } else if (!(typeof(element[i]) === 'object')) {
      text += element[i];
    }
  }
  if (element[0] === 'para' || element[0] === 'header') {
    text += '\n';
  }
  return text;
};
const convertMarkdownToText = (content) => {
  const tree = markdown.parse(content);
  return parseMarkdownTreeToText(tree);
};
const convertMarkdownToHtml = (content) => {
  return markdown.toHTML(content);
};

const process = async (config, logger, data) => {
  const serviceName = data.serviceName || 'DfE Sign-in';
  const requiresDigipass = data.requiresDigipass || false;
  let subject = data.selfInvoked
    ? `You’ve registered to join ${serviceName}`
    : `You’ve been invited to join ${serviceName}`;
  const overrides = Object.assign({}, data.overrides || {});

  if (overrides.subject) {
    subject = data.overrides.subject;
  }
  if (overrides.body) {
    overrides.textBody = convertMarkdownToText(overrides.body).trim();
    overrides.htmlBody = convertMarkdownToHtml(overrides.body);
  }

  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'invitation', {
    firstName: data.firstName,
    lastName: data.lastName,
    serviceName,
    requiresDigipass,
    selfInvoked: data.selfInvoked,
    code: data.code,
    returnUrl: `${config.notifications.profileUrl}/register/${data.invitationId}`,
    helpUrl: `${config.notifications.helpUrl}/contact`,
    overrides: overrides,
  }, subject);
};

const getHandler = (config, logger) => {
  return {
    type: 'invitation_v2',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};
