const SmsAdapter = require('./SmsAdapter');
const { NotifyClient } = require('notifications-node-client');

class GovNotifySmsAdapter extends SmsAdapter {
  constructor(config, logger) {
    super();

    this.logger = logger;
    this.config = config.notifications.sms.params;

    this.notifyClient = new NotifyClient(this.config.apiKey);
  }

  _getTemplateId(templateName) {
    const templates = this.config.templates;
    const templateNames = Object.keys(templates);
    if (!templateNames.find(x => x === templateName)) {
      return undefined;
    }
    return templates[templateName];
  }

  async send(recipient, template, data) {
    const templateId = this._getTemplateId(template);
    if (!templateId) {
      throw new Error(`No template by name ${template} has been configured`);
    }

    try {
      await this.notifyClient.sendSms(templateId, recipient, {
        personalisation: data,
      });
    } catch (e) {
      const status = e.error.status_code;
      const reason = e.error.errors[0];

      throw new Error(`Error sending ${template} SMS to ${recipient}. ${status}(${reason.error}): ${reason.message}`);
    }
  }
}

module.exports = GovNotifySmsAdapter;
