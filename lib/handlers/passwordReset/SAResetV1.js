const {getEmailAdapter} = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'sa-reset-password', {
    firstName: data.firstName,
    lastName: data.lastName,
    serviceId: data.services.id,
    returnUrl: `${config.notifications.profileUrl}/register/${data.invitationId}`,
  }, 'DfE Sign-in: reset your password');
};

const getHandler = (config, logger) => {
  return {
    type: 'sapasswordreset_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};
