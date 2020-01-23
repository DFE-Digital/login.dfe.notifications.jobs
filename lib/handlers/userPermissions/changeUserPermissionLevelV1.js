const { getEmailAdapter } = require('../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'user-persmission-level-changed', {
    firstName: data.firstName,
    lastName: data.lastName,
    orgName: data.orgName,
    roleName: data.roleName,
    signInUrl: `${config.notifications.servicesUrl}`,
    helpUrl: `${config.notifications.helpUrl}/contact`,
  }, `DfE Sign-in - Your ${data.orgName} permissions have changed`)
};

const getHandler = (config, logger) => {
  return {
    type: 'changeuserpermissionlevelrequest_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  }
};

module.exports = {
  getHandler,
};
