class SmsAdapter {
  constructor() {
    if (new.target === SmsAdapter) {
      throw new TypeError('Cannot construct SmsAdapter instances directly');
    }
  }

  async send(recipient, template, data) {
    return Promise.resolve({});
  }
}

module.exports = SmsAdapter;
