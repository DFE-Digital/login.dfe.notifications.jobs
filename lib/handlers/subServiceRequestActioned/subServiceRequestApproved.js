const { getEmailAdapter } = require('../../infrastructure/email');

const jobType = 'sub_service_request_approved';

const process = async (config, logger, data) => {
  try {
    const templateName = 'sub-service-request-approved';
    const subject = 'New sub-service added to your DfE Sign-in account';
    const emailAdapter = getEmailAdapter(config, logger);
    const endUserEmail = data.email;
    const emailData = {
      firstName: data.firstName,
      lastName: data.lastName,
      orgName: data.orgName,
      permission: data.permission,
      serviceName: data.serviceName,
      requestedSubServices: data.requestedSubServices,
      signInUrl: `${config.notifications.servicesUrl}/my-services`,
      helpUrl: `${config.notifications.helpUrl}/contact`,
    };

    await emailAdapter.send(endUserEmail, templateName, emailData, subject);
  } catch (e) {
    logger.error(`Failed to process and send the email for job type ${jobType}  - ${JSON.stringify(e)}`);
    throw new Error(`Failed to process and send the email for job type ${jobType} - ${JSON.stringify(e)}`);
  }
};

const getHandler = (config, logger) => ({
  type: jobType,
  processor: async (data) => {
    await process(config, logger, data);
  },
});

module.exports = {
  getHandler,
};
