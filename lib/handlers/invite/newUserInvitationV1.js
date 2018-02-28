const {getEmailAdapter} = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);
  await email.send(data.email, 'invitation', {
    firstName: data.firstName,
    lastName: data.lastName,
    serviceWelcomeMessage: 'You have been invited to join Key to Success',
    serviceWelcomeMessageDescription: 'To sign in to Key to Success we will need you to have your token ready as we take you through the steps needed to create your account',
    code: data.code,
    returnUrl: `${config.notifications.migrationUrl}/${data.invitationId}`,
  }, 'The way you access Key to Success is changing');
};

const getHandler = (config, logger) => {
  return {
    type: 'invitation_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};