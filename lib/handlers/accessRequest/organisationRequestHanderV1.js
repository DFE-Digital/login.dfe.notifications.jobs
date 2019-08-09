const OrganisatonsClient = require('./../../infrastructure/organisations');
const DirectoriesClient = require('./../../infrastructure/directories');
const kue = require('kue');
const { enqueue } = require('../utils');

const process = async (config, logger, data) => {
  const organisationsClient = new OrganisatonsClient(config.notifications.organisations);
  const directoriesClient = new DirectoriesClient(config.notifications.directories);

  const requestId = data.requestId;
  const request = await organisationsClient.getOrgRequestById(requestId);

  const approversForOrg = await organisationsClient.getApproversForOrganisation(request.organisation_id);
  const organisation = await organisationsClient.getOrganisationById(request.organisation_id);
  const user = await directoriesClient.getById(request.user_id);

  const queue = kue.createQueue({
    redis: config.queueStorage.connectionString,
  });

  if (approversForOrg.length > 0) {
    const approvers = await directoriesClient.getUsersByIds(approversForOrg);
    const approverEmails = approvers.map(x => x.email);
    await enqueue(queue, 'approveraccessrequest_v1', {
      recipients: approverEmails,
      orgName: organisation.name,
      userName: `${user.given_name} ${user.family_name}`,
      userEmail: user.email,
    });
  } else {
    await enqueue(queue, 'supportrequest_v1', {
      name: `${user.given_name} ${user.family_name}`,
      email: user.email,
      orgName: organisation.name,
      urn: organisation.urn || '',
      message: `Organisation request for ${organisation.name}, no approvers exist. Request reason: ${request.reason}`,
      type: 'Access to an organisation',
    });
  }
};

const getHandler = (config, logger) => {
  return {
    type: 'organisationrequest_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};
