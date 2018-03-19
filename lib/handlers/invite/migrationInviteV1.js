const {getEmailAdapter} = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'migration', {
    firstName: data.firstName,
    lastName: data.lastName,
    serviceWelcomeMessage: `The way you access Key to Success has changed, you will no longer use your Government Gateway login, but rather a new service called DfE Sign-in.`,
    serviceWelcomeMessageDescription: 'We have created a convenient way for you to migrate your Government Gateway details over to DfE Sign-in, simply follow the link below to create your DfE Sign-in account:',
    code: data.code,
    returnUrl: `${config.notifications.migrationUrl}/${data.invitationId}`,
  }, 'The way that you access Keys to Success has changed');
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