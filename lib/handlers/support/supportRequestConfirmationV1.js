const { getEmailAdapter } = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'support-request-confirmation', {
    name: data.name,
    service: data.service,
  }, `Your DfE Sign-in service desk request was received. Reference: ${data.reference}`);
};

const getHandler = (config, logger) => {
  return {
    type: 'supportrequestconfirmation_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};
