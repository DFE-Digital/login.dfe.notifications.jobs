const { getEmailAdapter } = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'verify-change-email', {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    code: data.code,
    returnUrl: `${config.notifications.profileUrl}/change-email/verify`,
  }, 'Verify your new DfE Sign-in email address');
};

const getHandler = (config, logger) => {
  return {
    type: 'verifychangeemail_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};