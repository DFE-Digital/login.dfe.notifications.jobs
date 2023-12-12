const aws = require('aws-sdk');
const EmailAdapter = require('./EmailAdapter');
const emailUtils = require('./utils');

const addContentType = (name, body, contentTypes) => {
  const type = contentTypes.find((item) => item.type.toLowerCase() === name.toLowerCase());
  if (!type) {
    return;
  }

  // Disable rule, as this function is expected to assign fields to "body".
  // eslint-disable-next-line no-param-reassign
  body[name] = {
    Data: type.content,
    Charset: 'UTF-8',
  };
};

class SESEmailAdapter extends EmailAdapter {
  constructor(config, logger) {
    super();

    this.sender = config.notifications.email.params.sender;
    this.returnEmail = config.notifications.email.params.returnEmail;
    this.logger = logger;

    const awsConfig = {};
    if (config.notifications.email.params && config.notifications.email.params.accessKey) {
      awsConfig.accessKeyId = config.notifications.email.params.accessKey;
    } else {
      this.logger.info('SESEmailAdapter- accessKeyId is missing');
    }
    if (config.notifications.email.params && config.notifications.email.params.accessSecret) {
      awsConfig.secretAccessKey = config.notifications.email.params.accessSecret;
    } else {
      this.logger.info('SESEmailAdapter- secretAccessKey is missing');
    }
    if (config.notifications.email.params && config.notifications.email.params.region) {
      awsConfig.region = config.notifications.email.params.region;
    } else {
      this.logger.info('SESEmailAdapter- region is missing');
    }

    aws.config.update(awsConfig);
  }

  async send(recipient, template, data, subject, bccRecipients) {
    try {
      const contentTypes = await emailUtils.renderEmailContent(template, data);

      return new Promise((resolve, reject) => {
        const ses = new aws.SES();

        const body = {};
        addContentType('Html', body, contentTypes);
        addContentType('Text', body, contentTypes);

        ses.sendEmail({
          Source: this.sender,
          Destination: {
            ToAddresses: [recipient],
            BccAddresses: [bccRecipients],
          },
          Message: {
            Subject: {
              Data: subject,
              Charset: 'UTF-8',
            },
            Body: body,
          },
          ReturnPath: this.returnEmail,
        }, (err) => {
          if (err) {
            this.logger.error(`Error sending ses email - ${JSON.stringify(err)}`);
            reject(err);
          } else {
            this.logger.info(`Sent ses email to ${recipient}`);
            resolve();
          }
        });
      });
    } catch (e) {
      this.logger.error(`Error sending ses email- outer catch block - ${JSON.stringify(e)}`);
      return Promise.reject(new Error(`Error sending ses email- outer catch block - ${JSON.stringify(e)}`));
    }
  }
}

module.exports = SESEmailAdapter;
