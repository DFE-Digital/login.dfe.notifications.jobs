const {getEmailAdapter} = require('./../../infrastructure/email');
const uuid = require('uuid/v4');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'password-reset', {
    code: data.code,
    clientId: data.clientId,
    returnUrl: `${config.notifications.interactionsUrl}/${uuid()}/resetpassword/${data.uid}/confirm?clientid=${data.clientId}`,
  }, 'Password reset');
};

const getHandler = (config, logger) => {
  return {
    type: 'passwordreset_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};