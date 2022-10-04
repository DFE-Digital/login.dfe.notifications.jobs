const { getEmailAdapter } = require('../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'user-service-added-v2', {
    firstName: data.firstName,
    lastName: data.lastName,
    orgName: data.orgName,
    permissionName: data.permissionName,
    serviceName: data.serviceName,
    requestedSubServices: data.requestedSubServices,
    signInUrl: `${config.notifications.servicesUrl}/my-services`,
    helpUrl: `${config.notifications.helpUrl}/contact`,
    helpApproverUrl: `${config.notifications.helpUrl}/approvers`,
  }, 'New service added to your DfE Sign-in account');
};

const getHandler = (config, logger) => ({
  type: 'userserviceadded_v2',
  processor: async (data) => {
    await process(config, logger, data);
  },
});

module.exports = {
  getHandler,
};
