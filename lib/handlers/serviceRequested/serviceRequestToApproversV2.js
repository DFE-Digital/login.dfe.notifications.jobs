const { getEmailAdapter } = require('../../infrastructure/email');
const OrganisatonsClient = require('../../infrastructure/organisations');
const DirectoriesClient = require('../../infrastructure/directories');

const process = async (config, logger, data) => {
  try {
    const organisationsClient = new OrganisatonsClient(config.notifications.organisations)
    const directoriesClient = new DirectoriesClient(config.notifications.directories)
    
    const email = getEmailAdapter(config, logger);
    const approversForOrg = await organisationsClient.getApproversForOrganisation(data.orgId)
    
    if (approversForOrg.length > 0) {
      const approvers = await directoriesClient.getUsersByIds(approversForOrg)

      for(let i=0; i < approvers.length; i++) {
        const name = `${approvers[i].given_name} ${approvers[i].family_name}`
        const approverEmail = approvers[i].email

        logger.info(`approvers - ${name} and ${approverEmail}`);
        
        logger.info(`email body - ${JSON.stringify({
          approverName: name,
          senderName: data.senderName,
          senderEmail: data.senderEmail,
          orgName: data.orgName,
          approveServiceUrl: data.approveServiceUrl,
          rejectServiceUrl: data.rejectServiceUrl,
          requestedServiceName: data.requestedServiceName,
          requestedSubServices: data.requestedSubServices
        })}`);

        await email.send(approverEmail, 'service-request-to-approvers', {
          approverName: name,
          senderName: data.senderName,
          senderEmail: data.senderEmail,
          orgName: data.orgName,
          approveServiceUrl: data.approveServiceUrl,
          rejectServiceUrl: data.rejectServiceUrl,
          requestedServiceName: data.requestedServiceName,
          requestedSubServices: data.requestedSubServices
        }, `A user has requested access to a service` )
      }
    }
  } catch (e) {
    logger.error(`Failed to process and send the email for type servicerequest_to_approvers_v2 - ${JSON.stringify(e)}`);
    throw new Error(`Failed to process and send the email for type servicerequest_to_approvers_v2 - ${JSON.stringify(e)}`); 
  }
};

const getHandler = (config, logger) => {
  return {
    type: 'servicerequest_to_approvers_v2',
    processor: async (data) => {
      await process(config, logger, data);
    }
  }
};

module.exports = {
  getHandler,
};