const EmailAdapter = require('./EmailAdapter');
const aws = require('aws-sdk');
const emailUtils = require('./utils');

const addContentType = (name, body, contentTypes) => {
  const type = contentTypes.find(item => item.type.toLowerCase() === name.toLowerCase());
  if (!type) {
    return;
  }

  body[name] = {
    Data: type.content,
    Charset: 'UTF-8',
  };
};

class SESEmailAdapter extends EmailAdapter {
  constructor(config, logger) {
    super();

    this.sender = config.notifications.email.params.sender;
    this.logger = logger;

    const awsConfig = {};
    if (config.notifications.email.params && config.notifications.email.params.accessKey) {
      awsConfig['accessKeyId'] = config.notifications.email.params.accessKey;
    }
    if (config.notifications.email.params && config.notifications.email.params.accessSecret) {
      awsConfig['secretAccessKey'] = config.notifications.email.params.accessSecret;
    }
    if (config.notifications.email.params && config.notifications.email.params.region) {
      awsConfig['region'] = config.notifications.email.params.region;
    }

    aws.config.update(awsConfig);
  }

  async send(recipient, template, data, subject) {
    const contentTypes = await emailUtils.renderEmailContent(template, data);

    return new Promise((resolve, reject) => {
      var ses = new aws.SES();

      var body = {};
      addContentType('Html', body, contentTypes);
      addContentType('Text', body, contentTypes);

      ses.sendEmail({
        Source: this.sender,
        Destination: {
          ToAddresses: [recipient],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8'
          },
          Body: body
        }
      }, (err) => {
        if (err) {
          this.logger.error(`Error sending ses email - ${JSON.stringify(err)}`);
          reject(err);
        } else {
          this.logger.info(`Sent ses email to ${recipient}`);
          resolve();
        }
      })
    });
  }
}

module.exports = SESEmailAdapter;
