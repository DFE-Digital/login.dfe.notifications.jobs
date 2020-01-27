const { getEmailAdapter } = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'support-overdue-request', {
    name: data.name,
    requestsCount: data.requestsCount,
    helpUrl: `${config.notifications.helpUrl}/contact`,
    servicesUrl:`${config.notifications.servicesUrl}/access-requests`,
  }, `DfE Sign-in - ${data.requestsCount} outstanding requests awaiting approval`);
};

const getHandler = (config, logger) => {
  return {
    type: 'supportoverduerequest',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};
