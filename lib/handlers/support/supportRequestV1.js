const { getEmailAdapter } = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(config.notifications.supportEmailAddress, 'support-request', {
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    service: data.service ? data.service : null,
    reference: data.reference,
  }, `DfE Sign-in service desk request: ${data.reference}`);
};

const getHandler = (config, logger) => {
  return {
    type: 'supportrequest_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};