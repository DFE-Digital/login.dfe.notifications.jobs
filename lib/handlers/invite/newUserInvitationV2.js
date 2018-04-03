const { getEmailAdapter } = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const serviceName = data.serviceName || 'DfE Sign-in';
  const requiresDigipass = data.requiresDigipass || false;
  const subject = data.selfInvoked
    ? `You’ve registered to join ${serviceName}`
    : `You’ve been invited to join ${serviceName}`;

  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'invitation', {
    firstName: data.firstName,
    lastName: data.lastName,
    serviceName,
    requiresDigipass,
    selfInvoked: data.selfInvoked,
    code: data.code,
    returnUrl: `${config.notifications.migrationUrl}/${data.invitationId}`,
  }, subject);
};

const getHandler = (config, logger) => {
  return {
    type: 'invitation_v2',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};