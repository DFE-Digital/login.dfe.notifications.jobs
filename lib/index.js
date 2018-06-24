const { union } = require('lodash');
const invite = require('./handlers/invite');
const passwordReset = require('./handlers/passwordReset');
const support = require('./handlers/support');
const registration = require('./handlers/registration');
const confirmMigratedEmail = require('./handlers/confirmMigratedEmail');
const changeProfile = require('./handlers/changeProfile');
const accessRequest = require('./handlers/accessRequest');

const register = (config, logger) => {
  const inviteHandlers = invite.register(config, logger);
  const passwordResetHandlers = passwordReset.register(config, logger);
  const supportHandlers = support.register(config, logger);
  const registrationHandlers = registration.register(config, logger);
  const confirmMigratedEmailHandlers = confirmMigratedEmail.register(config, logger);
  const changeProfileHandlers = changeProfile.register(config, logger);
  const accessRequestHandler = accessRequest.register(config, logger);

  return union(inviteHandlers, passwordResetHandlers, supportHandlers, registrationHandlers, confirmMigratedEmailHandlers, changeProfileHandlers, accessRequestHandler);
};

module.exports = {
  register,
};