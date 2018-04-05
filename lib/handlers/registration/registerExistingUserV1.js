const { getEmailAdapter } = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const serviceName = data.serviceName || 'DfE Sign-in';

  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'registerexistinguser', {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    serviceName,
    returnUrl: data.returnUrl,
  }, `You’ve registered to join ${serviceName}`);
};

const getHandler = (config, logger) => {
  return {
    type: 'registerexistinguser_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};