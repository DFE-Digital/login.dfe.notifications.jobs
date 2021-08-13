const { getEmailAdapter } = require('../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'user-service-added-v2', {
    firstName: data.firstName,
    lastName: data.lastName,
    orgName: data.orgName,
    serviceName: data.serviceName,
    requestedSubServices: data.requestedSubServices,
    signInUrl: `${config.notifications.servicesUrl}/my-services`
  }, `New service added` )
};

const getHandler = (config, logger) => {
  return {
    type: 'userserviceadded_v2',
    processor: async (data) => {
      await process(config, logger, data);
    }
  }
};

module.exports = {
  getHandler,
};
