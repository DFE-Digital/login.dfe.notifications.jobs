const { getEmailAdapter } = require('./../../infrastructure/email');
const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.approverEmail, 'service-request-to-approvers', {
    approverName: data.approverName, 
    senderName: data.senderName, 
    senderEmail: data.senderEmail, 
    orgName: data.orgName,
    approveServiceUrl: data.approveServiceUrl,
    rejectServiceUrl: data.rejectServiceUrl,
    requestedServiceName: data.requestedServiceName, 
    requestedSubServices: data.requestedSubServices
  }, `A user has requested access to a service` )
};

const getHandler = (config, logger) => {
  return {
    type: 'servicerequest_to_approvers_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  }
};

module.exports = {
  getHandler,
};