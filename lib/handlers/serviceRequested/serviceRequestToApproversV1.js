const { getEmailAdapter } = require('./../../infrastructure/email');
const OrganisatonsClient = require('./../../infrastructure/organisations');
const DirectoriesClient = require('./../../infrastructure/directories');

const process = async (config, logger, data) => {
  const organisationsClient = new OrganisatonsClient(config.notifications.organisations);
  const directoriesClient = new DirectoriesClient(config.notifications.directories);
  
  const email = getEmailAdapter(config, logger);
  const approversForOrg = await organisationsClient.getApproversForOrganisation(data.orgId);

  if (approversForOrg.length > 0) {
    const approvers = await directoriesClient.getUsersByIds(approversForOrg);

    for(let i =0; i < approvers.length; i++) {
      const approverName = approvers[i].name
      const approverEmail = approvers[i].email

      await email.send(approverEmail, 'service-request-to-approvers', {
        approverName, 
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