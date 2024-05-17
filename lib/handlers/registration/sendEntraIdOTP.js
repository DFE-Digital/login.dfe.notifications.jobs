const { getEmailAdapter } = require('../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'send-entraid-otp', {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    returnUrl: data.returnUrl,
  }, 'Your DfE Sign-in account has been created');
};

const getHandler = (config, logger) => ({
  type: 'sendentraidotp',
  processor: async (data) => {
    await process(config, logger, data);
  },
});

module.exports = {
  getHandler,
};
