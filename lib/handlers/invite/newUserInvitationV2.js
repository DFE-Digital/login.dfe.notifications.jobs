const { getEmailAdapter } = require('./../../infrastructure/email');
const {marked} = require('marked')

//tokens provided by the 'marked' lexer will be iterated.  For any given token
//it might have a property 'tokens' i.e. 'token.tokens' which if present is
//used.  The reason being is that token.text can return encoded markdown,
//where-as, if you iterate token.tokens you get the plain text version.
//In all cases then use the token.text where the token.type matches.
function parseMarkdownTreeToText(tokens) {
  let text = '';
  for (const token of tokens) {
    if (token.tokens){
      text += parseMarkdownTreeToText(token.tokens);
      text += getTokenTextNewLine(token);
    }
    else {
      if (token.type === 'text' || token.type === 'paragraph' || token.type === 'heading' || token.type === 'code') {
        text += decodeHtmlEntities(token.text);
        text += getTokenTextNewLine(token);
      }
      else if (token.type === 'space'){
        text += token.raw;
      }
    }
  }
  return text;
}

//Certain token types need to append a new line.
function getTokenTextNewLine(token){
  return (token.type === 'heading' || token.type === 'paragraph') ? '\n' : ''
}

//Its possible that 'marked' will HTML encode strings. For example, the word [You've] will be
//encoded as [You&#39;ve]. decodeHtmlEntities attempts to resolve this. Interstingly, this
//'issue' only happens with token.tokens leafs, and not the parent i.e. token.text = You've
//but a leaf will be token.tokens[0] = You&#39;ve  However, if you take the parent token.text
//you run into cases where it'll contain markdown i.e. "You've *ignore*" where-as the leaf
//will be token.tokens[0] = "You&#39;ve ignore"
const decodeHtmlEntities = (str) => {
  const htmlEntities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x27;': "'",
      '&#x2F;': '/',
      '&#x5C;': '\\',
      '&#96;': '`',
  };

  return str.replace(/&[#A-Za-z0-9]+;/g, (entity) => htmlEntities[entity] || entity);
};

const convertMarkdownToText = (content) => {
  const tokens = marked.lexer(content);
  return parseMarkdownTreeToText(tokens);
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
