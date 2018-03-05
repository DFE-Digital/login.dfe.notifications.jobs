const {getEmailAdapter} = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'migration', {
    firstName: data.firstName,
    lastName: data.lastName,
    serviceWelcomeMessage: data.serviceWelcomeMessage,
    serviceWelcomeMessageDescription: data.serviceWelcomeMessageDescription,
    returnUrl: `${config.notifications.migrationUrl}`,
  }, `The way you access Key to Success is changing`);
};

const getHandler = (config, logger) => {
  return {
    type: 'migrationinvite_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};