const { getEmailAdapter } = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'invitation', {
    firstName: data.firstName,
    lastName: data.lastName,
    serviceName: 'Key to Success',
    requiresDigipass: true,
    selfInvoked: false,
    code: data.code,
    returnUrl: `${config.notifications.migrationUrl}/${data.invitationId}`,
  }, data.code+' is your DfE Sign-in verification code');
};

const getHandler = (config, logger) => {
  return {
    type: 'invitation_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};
