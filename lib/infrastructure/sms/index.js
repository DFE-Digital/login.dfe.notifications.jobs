const DiskSmsAdapter = require('./DiskSmsAdapter');
const GovNotifySmsAdapter = require('./GovNotifySmsAdapter');

const getSmsAdapter = (config, logger) => {
  const type = (config.notifications && config.notifications.sms && config.notifications.sms.type)
    ? config.notifications.sms.type.toLowerCase() : 'disk';

  if (type === 'disk') {
    return new DiskSmsAdapter(config, logger);
  } else if (type === 'govnotify') {
    return new GovNotifySmsAdapter(config, logger);
  } else {
    throw new Error(`Unknown sms type ${type}`);
  }
};

module.exports = {
  getSmsAdapter,
};
