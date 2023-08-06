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
  try {
    const serviceName = data.serviceName || 'DfE Sign-in';
    const source = data.source || undefined;
    const requiresDigipass = data.requiresDigipass || false;
    let subject = data.selfInvoked
      ? `${data.code} is your DfE Sign-in verification code`
      : `You’ve been invited to join ${serviceName}`;
    const overrides = Object.assign({}, data.overrides || {});

    if (overrides.subject) {
      subject = data.overrides.subject;
    }
    if (overrides.body) {
      overrides.textBody = convertMarkdownToText(overrides.body).trim();
      overrides.htmlBody = convertMarkdownToHtml(overrides.body);
    }
    var template = data.isMigrationInvite ? 'migrationv2' : 'invitation';
      if(data.isChaserEmail)
      {
        template = 'invitation-chaser-email';
        subject = `You must take action to keep accessing the ${serviceName}`;
      }
      let bccEmail = 'NoReply.PireanMigration@education.gov.uk';
      if(process && process.env && process.env.INV_BCC_EMAIL){
        bccEmail = process.env.INV_BCC_EMAIL;
      }
      console.log(`bcc-email :${bccEmail}`);
    const email = getEmailAdapter(config, logger);
    await email.send(data.email, template, {
      firstName: data.firstName,
      lastName: data.lastName,
      serviceName,
      requiresDigipass,
      selfInvoked: data.selfInvoked,
      code: data.code,
      returnUrl: `${config.notifications.profileUrl}/register/${data.invitationId}?id=email`,
      helpUrl: `${config.notifications.helpUrl}/contact-us`,
      getmoreinfoUrl: `${config.notifications.helpUrl}/moving-to-DfE-Sign-in`,
      feConnectUrl: `${config.notifications.feConnectUrl}` || null,
      overrides: overrides,
      email: data.email,
      approverEmail: data.approverEmail,
      orgName: data.orgName,
      isApprover: data.isApprover,
      source: source,
    }, subject, bccEmail);

  } catch (e) {
    console.log(`bcc-email invitation_v2 :${JSON.stringify(e)}`);
    logger.error(`Failed to process and send the email for type invitation_v2- ${JSON.stringify(e)}`);
    throw new Error(`Failed to process and send the email for type invitation_v2 - ${JSON.stringify(e)}`);
  }

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
