const { getSmsAdapter } = require('./../../infrastructure/sms');

const process = async (config, logger, data) => {
  const sms = getSmsAdapter(config, logger);
  await sms.send(data.phoneNumber, '2FA', {
    code: data.code,
  });
};

const getHandler = (config, logger) => {
  return {
    type: 'secondfactorlogincode_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};