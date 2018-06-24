const { getEmailAdapter } = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'access-request-email', {
    orgName: data.orgName,
    firstName: data.firstName,
    lastName: data.lastName,
    approved: data.approved,
    reason: data.reason,
  }, `Request to access ${data.orgName}`);
};

const getHandler = (config, logger) => {
  return {
    type: 'accessrequest_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};