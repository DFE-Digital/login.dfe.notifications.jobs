const { getEmailAdapter } = require('./../../infrastructure/email');
const {marked} = require('marked')

//Convert tokens provided by the marked lexer into text.  Iterated 'tokens' looking for a property 'text'. 
//In this instance 'text' is the text representation of the markdown (MD) without formatting 
//(property 'raw' contains MD).  Some tokens don't have the 'text' property but do have 'type' 
//with a value of 'space' which represents '\n\n' - therefore use these.
const parseMarkdownTreeToText = (tokens) => {
  let text = '';
  for (const token of tokens) {
    if ('text' in token) {
      text += token.text;
    } else if ('type' in token && token.type == 'space' && 'raw' in token){
      text += token.raw
    }
  }
  return text;
};

const convertMarkdownToText = (content) => {
  const tree = markdown.parse(content);
  return parseMarkdownTreeToText(tree);
};

const convertMarkdownToHtml = (content) => {
  return marked.parse(content).trim();
};

const process = async (config, logger, data) => {
  try {
    const serviceName = data.serviceName;
    const source = data.source || undefined;
    const requiresDigipass = data.requiresDigipass || false;
    let subject = data.selfInvoked
      ? `${data.code} is your DfE Sign-in verification code`
      : `You’ve been invited to join DfE Sign-in`;
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
      if(data.isServiceActivationChaserEmail)
      {
        template = 'invitation-serviceactivation-chaser-email';
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
