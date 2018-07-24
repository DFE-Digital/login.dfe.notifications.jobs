const { getEmailAdapter } = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const serviceName = data.serviceName || 'DfE Sign-in';
  const requiresDigipass = data.requiresDigipass || false;
  let subject = data.selfInvoked
    ? `You’ve registered to join ${serviceName}`
    : `You’ve been invited to join ${serviceName}`;

  if (data.overrides && data.overrides.subject) {
    subject = data.overrides.subject;
  }
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'invitation', {
    firstName: data.firstName,
    lastName: data.lastName,
    serviceName,
    requiresDigipass,
    selfInvoked: data.selfInvoked,
    code: data.code,
    returnUrl: `${config.notifications.profileUrl}/register/${data.invitationId}`,
    overrides: data.overrides,
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